from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminManajemenAkunViewSet, AdminVerifikasiViewSet

router = DefaultRouter()
router.register(r'admin-verifikasi', AdminVerifikasiViewSet)
router.register(r'admin-manajemen-akun', AdminManajemenAkunViewSet)

urlpatterns = [
    path('', include(router.urls)),
]