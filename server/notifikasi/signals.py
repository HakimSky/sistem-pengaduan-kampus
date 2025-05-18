from django.db.models.signals import post_save
from django.dispatch import receiver
from pengaduan.models import Pengaduan
from notifikasi.models import Notifikasi
from pihak_kampus.models import PihakKampusPengaduan

@receiver(post_save, sender=Pengaduan)
def notifikasi_pengaduan_dibuat(sender, instance, created, **kwargs):
    if created:
        Notifikasi.objects.create(
            penerima=instance.pelapor, 
            jenis="Pengaduan",
            pesan=f"Pengaduan '{instance.kategori}' telah dibuat dan sedang menunggu verifikasi."
        )

@receiver(post_save, sender=Pengaduan)
def buat_notifikasi_pengaduan(sender, instance, **kwargs):
    if instance.verifikasi == "Diterima":  # Notifikasi hanya dikirim jika admin sudah memverifikasi
        Notifikasi.objects.create(
            penerima=instance.pelapor, 
            jenis="Verifikasi",
            pesan=f"Pengaduan '{instance.kategori}' telah diverifikasi dan sedang dalam proses."
        )

@receiver(post_save, sender=PihakKampusPengaduan)
def buat_notifikasi_selesai(sender, instance, **kwargs):
    if instance.status_kampus == "Selesai":
        Notifikasi.objects.create(
            penerima=instance.pengaduan.pelapor, 
            jenis="Sistem",
            pesan=f"Pengaduan '{instance.pengaduan.kategori}' telah selesai diproses oleh pihak kampus."
        )