from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminManajemenAkunViewSet, AdminVerifikasiViewSet, AdminUserStats, UserManagementViewSet

router = DefaultRouter()
router.register(r'admin-verifikasi', AdminVerifikasiViewSet)
router.register(r'admin-manajemen-akun', AdminManajemenAkunViewSet)
router.register(r'user-management', UserManagementViewSet, basename='user-management')

urlpatterns = [
    path('', include(router.urls)),
    path('admin-stats/', AdminUserStats.as_view(), name='admin-stats'),
]