# File: riwayat_pengaduan/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import RiwayatPengaduan
from .serializers import RiwayatPengaduanSerializer # Serializer baru yang kaya info
from warga_kampus.models import WargaKampus
from rest_framework import generics, permissions

class RiwayatPengaduanViewSet(viewsets.ModelViewSet):
    """
    ViewSet ini sekarang HANYA bertugas menampilkan SEMUA data riwayat.
    Tidak ada lagi logika 'get_queryset' atau 'permission_classes'.
    Ini adalah implementasi backend untuk 'metode profile.js'.
    """
    queryset = RiwayatPengaduan.objects.all().order_by('-waktu_perubahan')
    serializer_class = RiwayatPengaduanSerializer
class RiwayatByUserView(generics.ListAPIView):
    serializer_class = RiwayatPengaduanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # --- BLOK DEBUGGING DIMULAI ---
        print("\n" + "="*50)
        print("--- [DEBUG] MEMPROSES PERMINTAAN RIWAYAT BY USER ---")
        
        user = self.request.user
        
        print(f"--- [DEBUG] Tipe request.user: {type(user)}")
        print(f"--- [DEBUG] Apakah user terotentikasi: {user.is_authenticated}")
        print(f"--- [DEBUG] Username yang terlihat oleh server: {getattr(user, 'username', 'TIDAK DIKENALI (ANONYMOUS)')}")
        
        requested_user_id = self.kwargs.get('user_id')
        print(f"--- [DEBUG] ID User yang diminta dari URL: {requested_user_id}")
        print("="*50 + "\n")
        # --- BLOK DEBUGGING SELESAI ---

        # Kode logika utama tetap sama
        if not user.is_authenticated or user.id != requested_user_id:
            return RiwayatPengaduan.objects.none()

        try:
            warga_kampus_profile = WargaKampus.objects.get(user_id=requested_user_id)
            return RiwayatPengaduan.objects.filter(pengaduan__pelapor=warga_kampus_profile).order_by('-waktu_perubahan')
        except WargaKampus.DoesNotExist:
            return RiwayatPengaduan.objects.none()
