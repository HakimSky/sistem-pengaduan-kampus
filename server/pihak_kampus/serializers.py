from rest_framework import serializers
from .models import PihakKampus, PihakKampusPengaduan

class PihakKampusSerializer(serializers.ModelSerializer):
    class Meta:
        model = PihakKampus
        fields = '__all__'

class PihakKampusPengaduanSerializer(serializers.ModelSerializer):
    class Meta:
        model = PihakKampusPengaduan
        fields = '__all__'