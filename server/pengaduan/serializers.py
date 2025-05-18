from rest_framework import serializers
from .models import Pengaduan

class PengaduanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pengaduan
        fields = '__all__'