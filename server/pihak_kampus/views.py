from rest_framework import generics, permissions
from .models import Department, PihakKampusProfile
from .serializers import DepartmentSerializer, PihakKampusProfileSerializer

class DepartmentListAPIView(generics.ListAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class DepartmentDetailAPIView(generics.RetrieveAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class PihakKampusProfileListAPIView(generics.ListAPIView):
    queryset = PihakKampusProfile.objects.all()
    serializer_class = PihakKampusProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class PihakKampusProfileDetailAPIView(generics.RetrieveAPIView):
    queryset = PihakKampusProfile.objects.all()
    serializer_class = PihakKampusProfileSerializer
    permission_classes = [permissions.IsAuthenticated]