from django.contrib import admin
from .models import AdminVerifikasi, AdminManajemenAkun

@admin.register(AdminVerifikasi)
class AdminVerifikasiAdmin(admin.ModelAdmin):
    list_display = ('admin', 'pengaduan', 'status_verifikasi', 'waktu_verifikasi')
    list_filter = ('status_verifikasi',)
    search_fields = ('admin__username', 'pengaduan__kategori')

@admin.register(AdminManajemenAkun)
class AdminManajemenAkunAdmin(admin.ModelAdmin):
    list_display = ('admin', 'pengguna', 'aksi', 'waktu_aksi')
    list_filter = ('aksi',)
    search_fields = ('admin__username', 'pengguna__username')