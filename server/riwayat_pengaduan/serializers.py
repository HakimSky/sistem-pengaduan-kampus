from rest_framework import serializers
from .models import RiwayatPengaduan

class RiwayatPengaduanSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiwayatPengaduan
        fields = '__all__'