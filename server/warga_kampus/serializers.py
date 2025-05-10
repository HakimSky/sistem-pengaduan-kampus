from rest_framework import serializers
from .models import User, WargaKampusProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name', 'nim', 'phone_number']

class WargaKampusProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = WargaKampusProfile
        fields = ['id', 'user', 'fakultas', 'program_studi', 'angkatan']