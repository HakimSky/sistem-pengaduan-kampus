from django.db.models.signals import post_save
from django.dispatch import receiver
from login.models import CustomUser
from .models import WargaKampus

@receiver(post_save, sender=CustomUser)
def buat_profil_warga_kampus(sender, instance, created, **kwargs):
    if created and instance.role == "Warga Kampus":  # Hanya buat profil untuk warga kampus, bukan admin
        WargaKampus.objects.create(user=instance, nama=instance.username, email=instance.email)