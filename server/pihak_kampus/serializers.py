from rest_framework import serializers
from .models import Department, PihakKampusProfile

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description']

class PihakKampusProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    department = DepartmentSerializer()
    
    class Meta:
        model = PihakKampusProfile
        fields = ['id', 'user', 'department', 'position', 'is_active']