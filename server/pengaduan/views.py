from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import KategoriPengaduan, Pengaduan
from .serializers import KategoriPengaduanSerializer, PengaduanSerializer

class KategoriPengaduanListAPIView(generics.ListAPIView):
    queryset = KategoriPengaduan.objects.all()
    serializer_class = KategoriPengaduanSerializer
    permission_classes = [permissions.IsAuthenticated]

class PengaduanListAPIView(generics.ListAPIView):
    serializer_class = PengaduanSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'prioritas', 'kategori', 'pihak_terkait']
    search_fields = ['judul', 'uraian', 'lokasi']
    ordering_fields = ['tanggal_dibuat', 'tanggal_kejadian', 'prioritas']
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'warga_kampus':
            return Pengaduan.objects.filter(pelapor=user)
        elif user.role == 'pihak_kampus':
            return Pengaduan.objects.filter(pihak_terkait__pihakkampusprofile__user=user)
        elif user.role == 'admin':
            return Pengaduan.objects.all()
        return Pengaduan.objects.none()

class PengaduanDetailAPIView(generics.RetrieveAPIView):
    queryset = Pengaduan.objects.all()
    serializer_class = PengaduanSerializer
    permission_classes = [permissions.IsAuthenticated]