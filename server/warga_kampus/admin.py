from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, WargaKampusProfile

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_verified', 'is_staff')
    list_filter = ('role', 'is_verified', 'is_staff')
    search_fields = ('username', 'email', 'nim')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone_number', 'nim')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Role', {'fields': ('role', 'is_verified')}),
    )

admin.site.register(User, CustomUserAdmin)
admin.site.register(WargaKampusProfile)