from django.contrib import admin
from .models import CustomUser, Register, Login

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role')
    list_filter = ('role',)
    search_fields = ('username', 'email')

@admin.register(Register)
class RegisterAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'email', 'number')
    search_fields = ('full_name', 'email')

@admin.register(Login)
class LoginAdmin(admin.ModelAdmin):
    list_display = ('user', 'last_login')
    search_fields = ('user__username',)