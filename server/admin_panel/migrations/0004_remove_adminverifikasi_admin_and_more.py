# Generated by Django 5.2 on 2025-06-01 18:06

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_panel', '0003_alter_adminverifikasi_admin'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='adminverifikasi',
            name='admin',
        ),
        migrations.AddField(
            model_name='adminverifikasi',
            name='admin_yang_memverifikasi',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='verifikasi_dilakukan', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='adminverifikasi',
            name='status_verifikasi',
            field=models.CharField(choices=[('Belum Diverifikasi', 'Belum Diverifikasi'), ('Diterima', 'Diterima'), ('Ditolak', 'Ditolak')], default='Belum Diverifikasi', max_length=20),
        ),
        migrations.AlterField(
            model_name='adminverifikasi',
            name='waktu_verifikasi',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
