from rest_framework import viewsets
from .models import PihakKampus, PihakKampusPengaduan
from .serializers import PihakKampusSerializer, PihakKampusPengaduanSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class PihakKampusViewSet(viewsets.ModelViewSet):
    queryset = PihakKampus.objects.all()
    serializer_class = PihakKampusSerializer
class PihakKampusPengaduanViewSet(viewsets.ModelViewSet):
    serializer_class = PihakKampusPengaduanSerializer
    queryset = PihakKampusPengaduan.objects.all()

    def get_queryset(self):
        queryset = PihakKampusPengaduan.objects.select_related(
            'pengaduan',
            'pengaduan__pelapor',
            'pengaduan__pelapor__user', # Asumsi WargaKampus punya FK 'user' ke User Django
            # 'pengaduan__kategori' # Tidak perlu select_related jika kategori adalah CharField
        ).all()

        status_kampus = self.request.query_params.get('status_kampus')
        kategori = self.request.query_params.get('kategori') # Ambil parameter kategori

        if status_kampus:
            queryset = queryset.filter(status_kampus=status_kampus)
        
        if kategori:
            queryset = queryset.filter(pengaduan__kategori=kategori) # Filter berdasarkan kategori di Pengaduan
        
        # Urutkan berdasarkan tanggal kejadian terbaru di Pengaduan
        # Pastikan field tanggal_kejadian ada di model Pengaduan
        return queryset.order_by('-pengaduan__tanggal_kejadian')


    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        pengaduan_pihak_kampus = self.get_object() # instance PihakKampusPengaduan
        status_baru = request.data.get('status_kampus')

        if status_baru in ['Menunggu', 'Diproses', 'Selesai']:
            pengaduan_pihak_kampus.status_kampus = status_baru
            pengaduan_pihak_kampus.save() # Akan mentrigger signal
            return Response({'message': f'Status pengaduan berhasil diubah menjadi {status_baru}!'})
        return Response({'error': 'Status tidak valid'}, status=status.HTTP_400_BAD_REQUEST)