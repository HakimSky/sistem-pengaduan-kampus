# pihak_kampus/serializers.py
from rest_framework import serializers
from .models import PihakKampus, PihakKampusPengaduan
from pengaduan.serializers import PengaduanSerializer # Impor PengaduanSerializer yang sudah detail

class PihakKampusSerializer(serializers.ModelSerializer):
    class Meta:
        model = PihakKampus
        fields = '__all__'

class PihakKampusPengaduanSerializer(serializers.ModelSerializer):
    pengaduan_detail = PengaduanSerializer(source='pengaduan', read_only=True)
    # Opsional: Jika ingin menampilkan nama unit pihak kampus
    # nama_unit_pihak_kampus = serializers.CharField(source='pihak_kampus.nama_unit', read_only=True) # Sesuaikan field

    class Meta:
        model = PihakKampusPengaduan
        fields = [
            'id',
            'pihak_kampus', # ID dari PihakKampus
            # 'nama_unit_pihak_kampus', # Jika ditambahkan
            'pengaduan',    # ID dari Pengaduan asli
            'pengaduan_detail', # Objek detail Pengaduan dari PengaduanSerializer
            'status_kampus',
            # 'catatan_pihak_kampus', SUDAH DIHAPUS karena tidak diperlukan
        ]