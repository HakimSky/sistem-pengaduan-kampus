from django.contrib import admin
from .models import WargaKampus

@admin.register(WargaKampus)
class WargaKampusAdmin(admin.ModelAdmin):
    list_display = ('nama', 'email', 'no_hp', 'program_studi', 'jenis_kelamin')
    search_fields = ('nama', 'email', 'program_studi')