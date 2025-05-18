from rest_framework import viewsets
from .models import AdminVerifikasi, AdminManajemenAkun
from .serializers import AdminVerifikasiSerializer, AdminManajemenAkunSerializer

class AdminVerifikasiViewSet(viewsets.ModelViewSet):
    queryset = AdminVerifikasi.objects.all()
    serializer_class = AdminVerifikasiSerializer

class AdminManajemenAkunViewSet(viewsets.ModelViewSet):
    queryset = AdminManajemenAkun.objects.all()
    serializer_class = AdminManajemenAkunSerializer