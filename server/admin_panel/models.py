# admin_panel/models.py
from django.db import models
from django.contrib.auth.models import User
from pengaduan.models import Pengaduan # Pastikan model Pengaduan diimpor

class AdminVerifikasi(models.Model):
    # Field ini untuk mencatat SIAPA admin yang melakukan aksi verifikasi.
    # Akan diisi saat admin melakukan verifikasi, bukan saat objek ini dibuat otomatis oleh signal.
    admin_yang_memverifikasi = models.ForeignKey(
        User,
        on_delete=models.SET_NULL, # Jika admin dihapus, field ini jadi NULL
        null=True,
        blank=True,
        related_name='verifikasi_dilakukan' # related_name yang jelas
    )
    # Relasi ke pengaduan yang diverifikasi
    pengaduan = models.ForeignKey(Pengaduan, on_delete=models.CASCADE)
    
    # Pilihan status untuk proses verifikasi oleh admin
    STATUS_VERIFIKASI_CHOICES = [
        ('Belum Diverifikasi', 'Belum Diverifikasi'),
        ('Diterima', 'Diterima'), # Pengaduan diterima untuk diproses lebih lanjut
        ('Ditolak', 'Ditolak')    # Pengaduan ditolak
    ]
    status_verifikasi = models.CharField(
        max_length=20,
        choices=STATUS_VERIFIKASI_CHOICES,
        default='Belum Diverifikasi' # Default saat dibuat oleh signal
    )
    catatan_admin = models.TextField(null=True, blank=True) # Catatan dari admin terkait verifikasi
    waktu_verifikasi = models.DateTimeField(auto_now=True) # Waktu terakhir status verifikasi diubah

    def save(self, *args, **kwargs):
        """
        Override save method untuk mengupdate status 'verifikasi' di model Pengaduan
        ketika status_verifikasi di AdminVerifikasi berubah.
        """
        is_new = self._state.adding
        super().save(*args, **kwargs) # Simpan dulu objek AdminVerifikasi

        if not is_new or (is_new and self.status_verifikasi != 'Belum Diverifikasi'):
            # Jika objek sudah ada dan status_verifikasi berubah, atau objek baru tapi statusnya bukan default
            # kita update field 'verifikasi' di model Pengaduan terkait.
            if self.pengaduan.verifikasi != self.status_verifikasi:
                self.pengaduan.verifikasi = self.status_verifikasi
                # Hanya update field 'verifikasi' untuk efisiensi dan menghindari trigger signal lain jika ada
                self.pengaduan.save(update_fields=['verifikasi'])

    def __str__(self):
        """
        Representasi string untuk objek AdminVerifikasi.
        Menampilkan username PENGADU, kategori pengaduan, dan status verifikasi.
        """
        username_pengadu = "Pengadu Tidak Ada"
        # Akses username pengadu melalui self.pengaduan.pelapor.user.username
        # Pastikan model WargaKampus (pelapor) memiliki relasi 'user' ke model User Django
        if self.pengaduan and self.pengaduan.pelapor:
            if hasattr(self.pengaduan.pelapor, 'user') and self.pengaduan.pelapor.user:
                username_pengadu = self.pengaduan.pelapor.user.username
            elif hasattr(self.pengaduan.pelapor, 'nama'): # Fallback jika WargaKampus punya field 'nama'
                username_pengadu = self.pengaduan.pelapor.nama
            # Tambahkan fallback lain jika perlu

        kategori_pengaduan = "Kategori Tidak Ada"
        if self.pengaduan and hasattr(self.pengaduan, 'kategori'):
            # Menggunakan get_kategori_display() jika kategori adalah CharField dengan choices
            if hasattr(self.pengaduan, 'get_kategori_display'):
                kategori_pengaduan = self.pengaduan.get_kategori_display()
            # Jika kategori adalah ForeignKey ke model Kategori
            elif hasattr(self.pengaduan.kategori, 'nama'):
                kategori_pengaduan = self.pengaduan.kategori.nama
            else: # Fallback jika hanya string biasa
                kategori_pengaduan = str(self.pengaduan.kategori)
        
        return f"Pengadu: {username_pengadu} | Kategori: {kategori_pengaduan} | Status Verifikasi: {self.status_verifikasi}"

class AdminManajemenAkun(models.Model):
    # Field admin yang melakukan aksi manajemen akun
    admin = models.ForeignKey(User, on_delete=models.CASCADE)
    # User yang akunnya dikelola
    user_yang_dikelola = models.ForeignKey(User, on_delete=models.CASCADE, related_name='akun_dikelola')
    
    AKSI_CHOICES = [
        ('Nonaktifkan Akun', 'Nonaktifkan Akun'),
        ('Aktifkan Akun', 'Aktifkan Akun'),
        ('Hapus Akun', 'Hapus Akun')
        # Tambahkan aksi lain jika perlu, misal 'Reset Password', 'Ubah Role'
    ]
    aksi = models.CharField(max_length=50, choices=AKSI_CHOICES)
    waktu_aksi = models.DateTimeField(auto_now_add=True) # Waktu aksi dilakukan
    catatan_admin = models.TextField(null=True, blank=True) # Catatan terkait aksi

    def save(self, *args, **kwargs):
        """
        Override save method untuk menjalankan aksi manajemen akun setelah objek disimpan.
        """
        super().save(*args, **kwargs)

        # Jalankan aksi manajemen akun berdasarkan pilihan 'aksi'
        # Pastikan user_yang_dikelola bukan admin yang sedang login untuk mencegah self-lockout
        if self.admin == self.user_yang_dikelola and (self.aksi == 'Hapus Akun' or self.aksi == 'Nonaktifkan Akun'):
            # Tambahkan logging atau raise exception jika perlu, untuk mencegah admin menonaktifkan/menghapus diri sendiri
            print(f"PERINGATAN: Admin {self.admin.username} mencoba aksi '{self.aksi}' pada dirinya sendiri.")
            return # Atau raise ValidationError("Admin tidak dapat melakukan aksi ini pada dirinya sendiri.")

        if self.aksi == 'Hapus Akun':
            self.user_yang_dikelola.delete()
        elif self.aksi == 'Nonaktifkan Akun':
            self.user_yang_dikelola.is_active = False
            self.user_yang_dikelola.save(update_fields=['is_active'])
        elif self.aksi == 'Aktifkan Akun':
            self.user_yang_dikelola.is_active = True
            self.user_yang_dikelola.save(update_fields=['is_active'])

    def __str__(self):
        """
        Representasi string untuk objek AdminManajemenAkun.
        """
        admin_username = self.admin.username if self.admin else "Admin Tidak Ada"
        user_dikelola_username = self.user_yang_dikelola.username if self.user_yang_dikelola else "User Tidak Ada"
        return f"Aksi oleh {admin_username}: {self.aksi} pada {user_dikelola_username}"
