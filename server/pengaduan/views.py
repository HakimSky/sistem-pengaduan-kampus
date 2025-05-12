from rest_framework import viewsets
from .models import Pengaduan
from .serializers import PengaduanSerializer

class PengaduanViewSet(viewsets.ModelViewSet):
    queryset = Pengaduan.objects.all()
    serializer_class = PengaduanSerializer