from django.contrib import admin
from .models import Register

@admin.register(Register)
class RegisterAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'username', 'number', 'email')
    search_fields = ('username', 'email', 'full_name')