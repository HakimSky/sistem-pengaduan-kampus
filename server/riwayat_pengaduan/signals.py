from django.db.models.signals import post_save
from django.dispatch import receiver
from pengaduan.models import Pengaduan
from pihak_kampus.models import PihakKampusPengaduan
from riwayat_pengaduan.models import RiwayatPengaduan

@receiver(post_save, sender=Pengaduan)
def riwayat_setelah_verifikasi_admin(sender, instance, **kwargs):
    if instance.verifikasi == 'Diterima':  # Hanya pengaduan yang telah diverifikasi masuk riwayat
        RiwayatPengaduan.objects.create(pengaduan=instance, status=instance.status)

@receiver(post_save, sender=PihakKampusPengaduan)
def riwayat_setelah_pihak_kampus_memproses(sender, instance, **kwargs):
    RiwayatPengaduan.objects.create(pengaduan=instance.pengaduan, status=instance.status_kampus)