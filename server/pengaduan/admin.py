from django.contrib import admin
from .models import Pengaduan

@admin.register(Pengaduan)
class PengaduanAdmin(admin.ModelAdmin):
    list_display = ('kategori', 'pelapor', 'lokasi', 'tanggal_kejadian', 'status', 'verifikasi')
    list_filter = ('status', 'verifikasi')
    search_fields = ('kategori', 'lokasi')