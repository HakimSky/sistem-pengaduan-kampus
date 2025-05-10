from rest_framework import serializers
from .models import WargaKampus

class WargaKampusSerializer(serializers.ModelSerializer):
    class Meta:
        model = WargaKampus
        fields = '__all__'