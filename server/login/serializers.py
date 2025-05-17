from rest_framework import serializers
from django.contrib.auth.models import User
from warga_kampus.models import WargaKampus

class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    number = serializers.CharField(write_only=True)
    program_studi = serializers.CharField(write_only=True)
    jenis_kelamin = serializers.ChoiceField(
        write_only=True,
        choices=[('Laki-laki', 'Laki-laki'), ('Perempuan', 'Perempuan')],
        error_messages={
            'invalid_choice': 'Jenis kelamin harus Laki-laki atau Perempuan'
        }
    )
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'full_name', 'number', 'program_studi', 'jenis_kelamin']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # ambil data warga
        full_name = validated_data.pop('full_name')
        number = validated_data.pop('number')
        program_studi = validated_data.pop('program_studi')
        jenis_kelamin = validated_data.pop('jenis_kelamin')
        
        # buat user
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()

        # simpan profil warga
        WargaKampus.objects.create(
            user=user,
            nama=full_name,
            email=user.email,
            no_hp=number,
            program_studi=program_studi,
            jenis_kelamin=jenis_kelamin
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
