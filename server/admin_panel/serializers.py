from rest_framework import serializers
from .models import AdminVerifikasi, AdminManajemenAkun

class AdminVerifikasiSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminVerifikasi
        fields = '__all__'

class AdminManajemenAkunSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminManajemenAkun
        fields = '__all__'