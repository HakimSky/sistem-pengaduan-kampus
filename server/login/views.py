# File: login/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import RegisterSerializer, LoginSerializer, ChangePasswordSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer
import logging
from django.core.mail import send_mail
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.conf import settings
from django.core.mail import EmailMultiAlternatives # Ganti send_mail dengan ini
from django.template.loader import render_to_string # Untuk merender template
from django.utils.html import strip_tags # Untuk membuat versi teks biasa dari HTML

logger = logging.getLogger(__name__)

class RegisterViewSet(viewsets.ModelViewSet):
    """
    ViewSet untuk menangani pendaftaran user baru.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class LoginView(APIView):
    """
    View untuk menangani proses login user.
    """
    def post(self, request):
        logger.info(f"Mencoba login untuk user: {request.data.get('username')}")
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            
            if user:
                # Fungsi login(request, user) ini akan membuat sesi di database
                # dan secara OTOMATIS mengirim header 'Set-Cookie' dengan sessionid ke browser.
                login(request, user)
                
                logger.info(f"User {user.username} berhasil login.")
                
                # Kita tidak perlu lagi memanggil response.set_cookie(...) secara manual.
                return Response({
                    'message': 'Login berhasil',
                    'user_id': user.id,
                    'is_staff': user.is_staff,
                    'username': user.username,
                }, status=status.HTTP_200_OK)
            
            logger.warning(f"Login gagal untuk user {serializer.validated_data['username']}: Kredensial salah")
            return Response({'error': 'Username atau password salah.'}, status=status.HTTP_401_UNAUTHORIZED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        return Response({"message": "Endpoint ini hanya menerima metode POST untuk login."})

class LogoutView(APIView):
    """
    View untuk menangani proses logout user.
    """
    def post(self, request):
        # Fungsi logout akan menghapus data sesi dan cookie di sisi client.
        logout(request)
        return Response({'message': 'Logout berhasil.'}, status=status.HTTP_200_OK)

# --- MODIFIKASI ChangePasswordView ---
class ChangePasswordView(APIView):
    """
    View untuk mengubah password user yang SEDANG LOGIN.
    Membutuhkan autentikasi (session cookie) dan password lama.
    """
    permission_classes = [IsAuthenticated] # Benar, butuh user yang sudah login

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data.get('old_password')
            new_password = serializer.validated_data.get('new_password')

            # Verifikasi password lama
            if not user.check_password(old_password):
                return Response({'error': 'Password lama tidak sesuai.'}, status=status.HTTP_400_BAD_REQUEST)

            # Set password baru
            user.set_password(new_password)
            user.save()
            
            # Re-login user dengan password baru agar sesi tetap valid
            login(request, user)
            
            return Response({'message': 'Password berhasil diubah.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- VIEW BARU UNTUK LUPA PASSWORD (STEP 1: REQUEST RESET) ---
class PasswordResetRequestView(APIView):
    """
    View untuk memulai proses reset password dengan MENGIRIM EMAIL HTML.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'message': 'Jika email terdaftar, instruksi reset akan dikirim.'}, status=status.HTTP_200_OK)

            # Buat token dan link reset (sama seperti sebelumnya)
            token_generator = PasswordResetTokenGenerator()
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            token = token_generator.make_token(user)
            frontend_url = 'http://localhost:3000' # Pastikan ini URL frontend Anda
            reset_link = f'{frontend_url}/reset-password/{uidb64}/{token}/'

            # --- BAGIAN BARU: RENDER TEMPLATE & KIRIM EMAIL ---
            
            # 1. Siapkan konteks untuk template
            context = {
                'username': user.username,
                'reset_link': reset_link,
            }

            # 2. Render template HTML ke dalam sebuah string
            html_content = render_to_string('password_reset_email.html', context)
            
            # 3. Buat versi teks biasa sebagai fallback jika klien email tidak mendukung HTML
            text_content = strip_tags(html_content)

            # 4. Buat email menggunakan EmailMultiAlternatives
            email_subject = 'Reset Password Akun EL-Lapor Anda'
            from_email = settings.DEFAULT_FROM_EMAIL
            to_email = [user.email]

            email_message = EmailMultiAlternatives(
                subject=email_subject,
                body=text_content, # Versi teks biasa
                from_email=from_email,
                to=to_email
            )
            
            # 5. Lampirkan versi HTML
            email_message.attach_alternative(html_content, "text/html")

            # 6. Kirim email
            try:
                email_message.send()
            except Exception as e:
                logger.error(f"Gagal mengirim email reset password ke {user.email}: {e}")
                return Response({'error': 'Gagal mengirim email. Coba lagi nanti.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({'message': 'Jika email terdaftar, instruksi reset akan dikirim.'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- VIEW BARU UNTUK LUPA PASSWORD (STEP 2: CONFIRM RESET) ---
class PasswordResetConfirmView(APIView):
    """
    View untuk memvalidasi token dan mengatur password baru.
    Tidak memerlukan autentikasi.
    """
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            try:
                uid = force_str(urlsafe_base64_decode(uidb64))
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                user = None

            token_generator = PasswordResetTokenGenerator()
            if user is not None and token_generator.check_token(user, token):
                # Token valid, set password baru
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                return Response({'message': 'Password berhasil direset. Silakan login.'}, status=status.HTTP_200_OK)
            else:
                # Token tidak valid atau sudah digunakan
                return Response({'error': 'Tautan reset tidak valid atau telah kedaluwarsa.'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)