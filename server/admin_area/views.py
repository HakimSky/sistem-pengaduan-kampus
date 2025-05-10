from rest_framework import generics, status, viewsets, permissions  # <-- Tambahkan imports permissions di sini
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import VerifikasiPengaduan, AdminProfile
from .serializers import VerifikasiPengaduanSerializer, AdminProfileSerializer
from pengaduan.models import Pengaduan

class AdminProfileListAPIView(generics.ListAPIView):
    queryset = AdminProfile.objects.all()
    serializer_class = AdminProfileSerializer
    permission_classes = [permissions.IsAdminUser]  # <-- Sekarang permissions sudah terdefinisi

class VerifikasiPengaduanViewSet(viewsets.ModelViewSet):
    queryset = VerifikasiPengaduan.objects.all()
    serializer_class = VerifikasiPengaduanSerializer
    permission_classes = [permissions.IsAdminUser]  # <-- Tambahkan permission untuk ViewSet
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        verifikasi = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Pengaduan.STATUS_CHOICES):
            return Response({'error': 'Status tidak valid'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update status pengaduan
        pengaduan = verifikasi.pengaduan
        pengaduan.status = new_status
        pengaduan.save()
        
        # Update verifikasi
        verifikasi.status_verifikasi = True if new_status == 'diverifikasi' else False
        verifikasi.catatan = request.data.get('catatan', '')
        verifikasi.save()
        
        return Response({'message': 'Status berhasil diperbarui'})