from rest_framework import serializers
from .models import KategoriPengaduan, Pengaduan, LampiranPengaduan
from warga_kampus.serializers import UserSerializer
from pihak_kampus.serializers import DepartmentSerializer

class KategoriPengaduanSerializer(serializers.ModelSerializer):
    class Meta:
        model = KategoriPengaduan
        fields = ['id', 'nama', 'deskripsi']

class LampiranPengaduanSerializer(serializers.ModelSerializer):
    class Meta:
        model = LampiranPengaduan
        fields = ['id', 'file', 'deskripsi', 'tanggal_upload']

class PengaduanSerializer(serializers.ModelSerializer):
    pelapor = UserSerializer(read_only=True)
    kategori = KategoriPengaduanSerializer()
    pihak_terkait = DepartmentSerializer()
    penangan = UserSerializer()
    lampiran = LampiranPengaduanSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pengaduan
        fields = [
            'id', 'judul', 'pelapor', 'kategori', 'uraian', 
            'tanggal_kejadian', 'lokasi', 'tanggal_dibuat', 
            'tanggal_diperbarui', 'status', 'prioritas', 
            'pihak_terkait', 'penangan', 'tanggal_verifikasi',
            'tanggal_penanganan', 'tanggal_selesai', 'lampiran'
        ]