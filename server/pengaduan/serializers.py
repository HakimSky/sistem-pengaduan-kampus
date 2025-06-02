# pengaduan/serializers.py
from rest_framework import serializers
from .models import Pengaduan
from warga_kampus.models import WargaKampus # Pastikan path ini benar

class SimpleWargaKampusSerializer(serializers.ModelSerializer):
    """
    Serializer sederhana untuk menampilkan informasi dasar pelapor (WargaKampus).
    Sesuaikan 'source' berdasarkan field di model User atau WargaKampus Anda.
    """
    # Asumsi WargaKampus memiliki ForeignKey 'user' ke model User Django standar
    # atau WargaKampus memiliki field nama sendiri.
    username = serializers.CharField(source='user.username', read_only=True, allow_null=True)
    # Jika WargaKampus punya field nama, contoh:
    # nama_lengkap = serializers.CharField(source='nama_lengkap_warga', read_only=True, allow_null=True)

    class Meta:
        model = WargaKampus
        # Pilih field yang ingin ditampilkan untuk pelapor
        fields = ['username'] # atau ['nama_lengkap'] atau keduanya

class PengaduanSerializer(serializers.ModelSerializer):
    """
    Serializer detail untuk model Pengaduan.
    """
    kategori_display = serializers.CharField(source='get_kategori_display', read_only=True)
    pelapor_detail = SimpleWargaKampusSerializer(source='pelapor', read_only=True)
    
    # Jika model Pengaduan kamu punya field 'judul'
    # judul = serializers.CharField(allow_null=True, required=False) 

    class Meta:
        model = Pengaduan
        fields = [
            'id',
            # 'judul', # Uncomment jika ada field judul di model Pengaduan
            'pelapor',          # ID WargaKampus
            'pelapor_detail',   # Objek detail pelapor (dari SimpleWargaKampusSerializer)
            'kategori',         # Nilai mentah kategori (misal: 'Jalan rusak')
            'kategori_display', # Tampilan kategori (misal: 'Jalan rusak')
            'deskripsi',
            'gambar',           # URL gambar
            'lokasi',
            'tanggal_kejadian', # Hanya tanggal kejadian
            'status',           # Status dari model Pengaduan
            'verifikasi',       # Status verifikasi dari model Pengaduan
        ]