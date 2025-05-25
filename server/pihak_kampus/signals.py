from pihak_kampus.models import PihakKampus, PihakKampusPengaduan
from pengaduan.models import Pengaduan
from notifikasi.models import Notifikasi
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=Pengaduan)
def buat_notifikasi_pengaduan(sender, instance, created, **kwargs):
    if instance.verifikasi == "Diterima":
        # Buat notifikasi
        Notifikasi.objects.create(
            penerima=instance.pelapor,
            jenis="Verifikasi",
            pesan=f"Pengaduan '{instance.kategori}' telah diverifikasi dan sedang dalam proses."
        )

        # Buat record PihakKampusPengaduan
        pihak_kampus = PihakKampus.objects.first()  # default ke yang pertama
        if pihak_kampus:
            PihakKampusPengaduan.objects.get_or_create(
                pengaduan=instance,
                pihak_kampus=pihak_kampus,
                defaults={"status_kampus": "Menunggu"}
            )

@receiver(post_save, sender=PihakKampusPengaduan)
def update_status_pengaduan(sender, instance, **kwargs):
    # Update status Pengaduan sesuai status_kampus tanpa trigger post_save lagi
    Pengaduan.objects.filter(pk=instance.pengaduan.pk).update(status=instance.status_kampus)
