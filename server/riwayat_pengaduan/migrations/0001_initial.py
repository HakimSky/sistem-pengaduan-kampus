# Generated by Django 5.2 on 2025-05-10 12:08

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('pengaduan', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='RiwayatPengaduan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('Menunggu', 'Menunggu'), ('Diproses', 'Diproses'), ('Selesai', 'Selesai')], max_length=10)),
                ('waktu_perubahan', models.DateTimeField(auto_now_add=True)),
                ('pengaduan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='riwayat', to='pengaduan.pengaduan')),
            ],
        ),
    ]
