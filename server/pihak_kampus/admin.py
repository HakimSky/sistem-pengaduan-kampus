from django.contrib import admin
from .models import PihakKampus, PihakKampusPengaduan

@admin.register(PihakKampus)
class PihakKampusAdmin(admin.ModelAdmin):
    list_display = ('nama_kampus', 'department', 'position')  # Menampilkan data kampus
    search_fields = ('nama_kampus', 'department')  # Fitur pencarian berdasarkan kampus & department

@admin.register(PihakKampusPengaduan)
class PihakKampusPengaduanAdmin(admin.ModelAdmin):
    list_display = ('pengaduan', 'pihak_kampus', 'status_kampus')  # Menampilkan pengaduan dan statusnya
    list_filter = ('status_kampus',)  # Mempermudah filter berdasarkan status pengaduan
    search_fields = ('pengaduan__kategori', 'pihak_kampus__department')  # Mencari pengaduan berdasarkan kategori dan departemen