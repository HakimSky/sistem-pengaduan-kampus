from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User # Pastikan User diimpor jika digunakan di signal kedua

from pengaduan.models import Pengaduan
from admin_panel.models import AdminVerifikasi, AdminManajemenAkun # Impor model yang relevan

@receiver(post_save, sender=Pengaduan)
def buat_verifikasi_otomatis(sender, instance, created, **kwargs):
    """
    Signal yang akan otomatis membuat objek AdminVerifikasi baru
    setiap kali sebuah objek Pengaduan baru ('created') berhasil disimpan.
    """
    if created:
        # Membuat entri AdminVerifikasi yang terhubung ke Pengaduan baru.
        # Field 'admin_yang_memverifikasi' tidak diisi di sini, akan diisi
        # nanti ketika admin melakukan aksi verifikasi.
        # 'status_verifikasi' akan menggunakan nilai default dari model ('Belum Diverifikasi').
        AdminVerifikasi.objects.create(pengaduan=instance)
        print(f"AdminVerifikasi otomatis dibuat untuk pengaduan ID: {instance.id}")

# @receiver(post_save, sender=User)
# def buat_manajemen_akun_otomatis(sender, instance, created, **kwargs):
#     """
#     Otomatis membuat entri AdminManajemenAkun saat User baru dibuat.
#     """
#     if created:
#         # Pastikan field pada AdminManajemenAkun juga sesuai.
#         # Jika AdminManajemenAkun juga memiliki field yang NOT NULL dan tidak diset di sini,
#         # error serupa bisa terjadi untuk signal ini.
#         AdminManajemenAkun.objects.create(
#             user_yang_dikelola=instance,
#             aksi='ditambahkan'
#         )