# File: riwayat_pengaduan/serializers.py

from rest_framework import serializers
from .models import RiwayatPengaduan
from pengaduan.models import Pengaduan

# Serializer detail untuk Pengaduan, khusus untuk Riwayat
class PengaduanDetailForRiwayatSerializer(serializers.ModelSerializer):
    # Ambil ID user dari relasi: pengaduan -> pelapor (WargaKampus) -> user (User)
    pelapor_user_id = serializers.IntegerField(source='pelapor.user.id', read_only=True)
    kategori_display = serializers.CharField(source='get_kategori_display', read_only=True)

    class Meta:
        model = Pengaduan
        fields = [
            'id', 'deskripsi', 'lokasi', 'gambar', 'tanggal_kejadian',
            'kategori_display', 'status', 'pelapor_user_id' # <-- Pastikan pelapor_user_id ada di sini
        ]

# Serializer utama untuk RiwayatPengaduan
class RiwayatPengaduanSerializer(serializers.ModelSerializer):
    pengaduan = PengaduanDetailForRiwayatSerializer(read_only=True)

    class Meta:
        model = RiwayatPengaduan
        fields = ['id', 'pengaduan', 'status', 'waktu_perubahan']