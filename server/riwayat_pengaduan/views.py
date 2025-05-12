from rest_framework import viewsets
from .models import RiwayatPengaduan
from .serializers import RiwayatPengaduanSerializer

class RiwayatPengaduanViewSet(viewsets.ModelViewSet):
    queryset = RiwayatPengaduan.objects.all()
    serializer_class = RiwayatPengaduanSerializer