# admin_panel/serializers.py
from rest_framework import serializers
from .models import AdminVerifikasi, AdminManajemenAkun # Pastikan AdminManajemenAkun juga diimpor jika ada
from pengaduan.models import Pengaduan 
from django.contrib.auth.models import User # Untuk mengambil username admin yang memverifikasi

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        # Pastikan fields ini sesuai dengan yang Anda butuhkan di frontend
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'is_active', 'is_superuser', # is_superuser penting untuk identifikasi Admin
            'date_joined', 'last_login', 'role'
        ]
        read_only_fields = ['date_joined', 'last_login', 'role', 'is_superuser']

    def get_role(self, obj):
        # obj adalah instance User
        if obj.is_superuser or obj.username.lower() == 'admin': # Cek is_superuser atau username 'admin'
            return "Admin" # Atau "Super Admin"
        if obj.username.lower().startswith("ums_"):
            return "Pihak Kampus"
        return "Warga Kampus"

class PengaduanDetailForVerifikasiSerializer(serializers.ModelSerializer):
    """
    Serializer untuk menampilkan detail Pengaduan yang relevan dalam konteks verifikasi.
    Termasuk username pelapor dan display kategori.
    """
    username_pelapor = serializers.SerializerMethodField()
    kategori_display = serializers.SerializerMethodField()
    # Pastikan model Pengaduan Anda memiliki field 'judul'
    # Jika tidak, sesuaikan field yang diambil atau hapus 'judul' dari fields.
    # Asumsi 'judul' ada di model Pengaduan.
    judul = serializers.CharField(source='get_judul_pengaduan', read_only=True)


    class Meta:
        model = Pengaduan
        fields = [
            'id', 
            'judul', 
            'username_pelapor', 
            'kategori_display', 
            'deskripsi', 
            'lokasi', 
            'gambar', 
            'tanggal_kejadian',
            'status', 
            'verifikasi' 
        ]

    def get_judul_pengaduan(self, obj):
        # obj adalah instance Pengaduan
        # Cek apakah Pengaduan punya field 'judul'
        if hasattr(obj, 'judul'):
            return obj.judul
        return "Judul Tidak Tersedia" # Atau string default lainnya

    def get_username_pelapor(self, obj):
        if obj.pelapor and hasattr(obj.pelapor, 'user') and obj.pelapor.user:
            return obj.pelapor.user.username
        elif obj.pelapor and hasattr(obj.pelapor, 'nama'):
            return obj.pelapor.nama
        return "Pelapor Tidak Diketahui"

    def get_kategori_display(self, obj):
        if hasattr(obj, 'get_kategori_display'):
            return obj.get_kategori_display()
        elif obj.kategori and hasattr(obj.kategori, 'nama'): # Jika FK ke model Kategori
            return obj.kategori.nama
        elif obj.kategori: # Jika CharField biasa
             return str(obj.kategori)
        return "Kategori Tidak Diketahui"

class AdminVerifikasiSerializer(serializers.ModelSerializer):
    pengaduan_detail = PengaduanDetailForVerifikasiSerializer(source='pengaduan', read_only=True)
    admin_yang_memverifikasi_detail = UserSerializer(source='admin_yang_memverifikasi', read_only=True)

    class Meta:
        model = AdminVerifikasi
        fields = [
            'id', 
            'pengaduan', # ID pengaduan (write-only, untuk relasi)
            'pengaduan_detail', 
            'status_verifikasi', 
            'catatan_admin',
            'waktu_verifikasi',
            'admin_yang_memverifikasi', # ID admin (write-only, untuk relasi)
            'admin_yang_memverifikasi_detail'
        ]
        extra_kwargs = {
            # 'pengaduan' field di sini merujuk pada ForeignKey di model AdminVerifikasi
            # yang menunjuk ke instance Pengaduan. Saat membuat/update AdminVerifikasi,
            # Anda mungkin hanya perlu mengirim ID Pengaduan.
            'pengaduan': {'write_only': True, 'required': True, 'allow_null': False}, # Pastikan pengaduan selalu ada saat create
            'admin_yang_memverifikasi': {'write_only': True, 'required': False, 'allow_null': True}
        }
        read_only_fields = ['waktu_verifikasi']


    def update(self, instance, validated_data):
        request = self.context.get('request', None)
        if request and hasattr(request, "user") and request.user.is_authenticated:
            # Hanya set admin_yang_memverifikasi jika status verifikasi bukan 'Belum Diverifikasi'
            # atau jika memang ada perubahan yang dilakukan oleh admin.
            if validated_data.get('status_verifikasi', instance.status_verifikasi) != 'Belum Diverifikasi':
                 instance.admin_yang_memverifikasi = request.user
            elif 'catatan_admin' in validated_data and instance.admin_yang_memverifikasi is None: # Jika admin menambah catatan pada yg belum diverif
                 instance.admin_yang_memverifikasi = request.user


        instance.status_verifikasi = validated_data.get('status_verifikasi', instance.status_verifikasi)
        instance.catatan_admin = validated_data.get('catatan_admin', instance.catatan_admin)
        
        instance.save() 
        return instance

# Serializer untuk AdminManajemenAkun (jika Anda menggunakannya di API lain)
class AdminManajemenAkunSerializer(serializers.ModelSerializer):
    admin_detail = UserSerializer(source='admin', read_only=True)
    user_yang_dikelola_detail = UserSerializer(source='user_yang_dikelola', read_only=True)

    class Meta:
        model = AdminManajemenAkun
        fields = [
            'id',
            'admin', # write-only
            'admin_detail', # read-only
            'user_yang_dikelola', # write-only
            'user_yang_dikelola_detail', # read-only
            'aksi',
            'waktu_aksi',
            'catatan_admin'
        ]
        extra_kwargs = {
            'admin': {'write_only': True, 'required': False}, # Akan diisi dari request.user di view
            'user_yang_dikelola': {'write_only': True}
        }
        read_only_fields = ('waktu_aksi',)

    def create(self, validated_data):
        request = self.context.get('request', None)
        if request and hasattr(request, "user") and request.user.is_authenticated:
            validated_data['admin'] = request.user # Otomatis set admin yang melakukan aksi
        return super().create(validated_data)
