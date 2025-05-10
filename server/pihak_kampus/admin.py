from django.contrib import admin
from .models import PihakKampus

@admin.register(PihakKampus)
class PihakKampusAdmin(admin.ModelAdmin):
    list_display = ('nama_kampus', 'department', 'position')
    search_fields = ('nama_kampus', 'department')