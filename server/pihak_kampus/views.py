from rest_framework import viewsets
from .models import PihakKampus, PihakKampusPengaduan
from .serializers import PihakKampusSerializer, PihakKampusPengaduanSerializer
from rest_framework.decorators import action

class PihakKampusViewSet(viewsets.ModelViewSet):
    queryset = PihakKampus.objects.all()
    serializer_class = PihakKampusSerializer
class PihakKampusPengaduanViewSet(viewsets.ModelViewSet):
    queryset = PihakKampusPengaduan.objects.all()
    serializer_class = PihakKampusPengaduanSerializer

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        pengaduan = self.get_object()
        status_baru = request.data.get('status_kampus')
        if status_baru in ['Menunggu', 'Diproses', 'Selesai']:
            pengaduan.status_kampus = status_baru
            pengaduan.save()
            return Response({'message': 'Status updated!'})
        return Response({'error': 'Status tidak valid'}, status=400)