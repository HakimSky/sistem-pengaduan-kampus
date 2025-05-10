from django.contrib import admin
from .models import Login, Register

@admin.register(Login)
class LoginAdmin(admin.ModelAdmin):
    list_display = ('username',)
    search_fields = ('username',)

@admin.register(Register)
class RegisterAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'username', 'number', 'email')
    search_fields = ('username', 'email', 'full_name')