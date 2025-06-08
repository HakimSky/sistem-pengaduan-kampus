# File: login/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from .serializers import RegisterSerializer, LoginSerializer
import logging

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

class ChangePasswordView(APIView):
    """
    View untuk mengubah password user yang sedang login.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        new_password = request.data.get('new_password')
        
        if new_password and len(new_password) >= 8: # Tambahkan validasi dasar
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password berhasil diubah.'})
            
        return Response({'error': 'Password baru diperlukan dan minimal 8 karakter.'}, status=status.HTTP_400_BAD_REQUEST)