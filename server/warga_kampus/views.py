from rest_framework import generics, permissions
from .models import User, WargaKampusProfile
from .serializers import UserSerializer, WargaKampusProfileSerializer

class UserListAPIView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class UserDetailAPIView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class WargaKampusProfileListAPIView(generics.ListAPIView):
    queryset = WargaKampusProfile.objects.all()
    serializer_class = WargaKampusProfileSerializer
    permission_classes = [permissions.IsAdminUser]

class WargaKampusProfileDetailAPIView(generics.RetrieveAPIView):
    queryset = WargaKampusProfile.objects.all()
    serializer_class = WargaKampusProfileSerializer
    permission_classes = [permissions.IsAuthenticated]