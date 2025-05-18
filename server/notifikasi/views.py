from rest_framework import viewsets
from .models import Notifikasi
from .serializers import NotifikasiSerializer

class NotifikasiViewSet(viewsets.ModelViewSet):
    queryset = Notifikasi.objects.all()
    serializer_class = NotifikasiSerializer