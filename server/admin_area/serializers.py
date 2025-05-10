from rest_framework import serializers
from .models import AdminProfile, VerifikasiPengaduan
from pengaduan.serializers import PengaduanSerializer
from warga_kampus.serializers import UserSerializer

class AdminProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = AdminProfile
        fields = ['id', 'user', 'jabatan', 'is_active']

class VerifikasiPengaduanSerializer(serializers.ModelSerializer):
    pengaduan = PengaduanSerializer(read_only=True)
    admin = UserSerializer(read_only=True)
    
    class Meta:
        model = VerifikasiPengaduan
        fields = ['id', 'pengaduan', 'admin', 'tanggal_verifikasi', 'catatan', 'status_verifikasi']