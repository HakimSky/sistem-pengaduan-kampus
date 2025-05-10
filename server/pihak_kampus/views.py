from rest_framework import viewsets
from .models import PihakKampus, PihakKampusPengaduan
from .serializers import PihakKampusSerializer, PihakKampusPengaduanSerializer

class PihakKampusViewSet(viewsets.ModelViewSet):
    queryset = PihakKampus.objects.all()
    serializer_class = PihakKampusSerializer

class PihakKampusPengaduanViewSet(viewsets.ModelViewSet):
    queryset = PihakKampusPengaduan.objects.all()
    serializer_class = PihakKampusPengaduanSerializer