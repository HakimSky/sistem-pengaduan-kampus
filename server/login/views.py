from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, LoginSerializer
from django.contrib.auth import logout
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from django.contrib.auth.models import User

class RegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class LoginView(APIView):
    def get(self, request):
        return Response({"message": "Gunakan POST untuk login dengan username & password"})

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user:
                return Response({'message': 'Login berhasil', 'user_id': user.id})
            return Response({'error': 'Login gagal'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# login/views.py

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
