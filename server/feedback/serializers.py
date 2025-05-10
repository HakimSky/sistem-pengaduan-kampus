from rest_framework import serializers
from .models import Feedback
from pengaduan.serializers import PengaduanSerializer
from warga_kampus.serializers import UserSerializer

class FeedbackSerializer(serializers.ModelSerializer):
    pengaduan = PengaduanSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Feedback
        fields = [
            'id', 'pengaduan', 'user', 'rating', 'komentar',
            'tanggal_dibuat', 'tanggal_diperbarui', 'dibaca'
        ]