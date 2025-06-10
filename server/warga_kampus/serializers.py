from rest_framework import serializers
from .models import WargaKampus

class WargaKampusSerializer(serializers.ModelSerializer):
    # Field ini akan MEMBACA path gambar dan mengubahnya menjadi URL lengkap.
    # Contoh: 'profile_pics/gambar.jpg' -> '/media/profile_pics/gambar.jpg'
    # Ini adalah bagian KUNCI yang sering terlewat.
    foto_profil_url = serializers.ImageField(source='foto_profil', read_only=True)

    class Meta:
        model = WargaKampus
        fields = [
            'id', 
            'user', 
            'nama', 
            'email', 
            'no_hp', 
            'program_studi', 
            'jenis_kelamin', 
            'foto_profil',      # Untuk MENERIMA file upload (write-only).
            'foto_profil_url'   # Untuk MENGIRIM URL kembali ke React (read-only).
        ]
        # Membuat 'foto_profil' hanya bisa ditulis, tidak dibaca.
        extra_kwargs = {
            'foto_profil': {'write_only': True, 'required': False}
        }
