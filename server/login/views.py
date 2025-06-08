from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from .serializers import RegisterSerializer, LoginSerializer
from django.contrib.auth import logout
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
import logging

logger = logging.getLogger(__name__)

class RegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class LoginView(APIView):
    @method_decorator(ensure_csrf_cookie, name='dispatch')
    def post(self, request):
        logger.info(f"Login attempt for {request.data.get('username')}")
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user:
                login(request, user)
                session_key = request.session.session_key
                logger.info(f"User {user.username} logged in, Session ID: {session_key}")
                response = Response({
                    'message': 'Login berhasil',
                    'user_id': user.id,
                    'is_staff': user.is_staff,
                    'username': user.username,
                    'session_key': session_key  # Kirim session key ke client
                })
                response.set_cookie(
                    'sessionid',
                    session_key,
                    httponly=True,
                    secure=False,  # False buat dev
                    samesite='Lax'
                )
                return response
            return Response({'error': 'Login gagal'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        return Response({"message": "Gunakan POST untuk login dengan username & password"})

class LogoutView(APIView):
    def get(self, request):
        return Response({"message": "Gunakan POST untuk logout"})

    def post(self, request):
        logout(request)
        return Response({'message': 'Logout berhasil'})

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Gunakan POST untuk ubah password"})

    def post(self, request):
        user = request.user
        new_password = request.data.get('new_password')
        if new_password:
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password berhasil diubah'})
        return Response({'error': 'Password baru diperlukan'}, status=400)