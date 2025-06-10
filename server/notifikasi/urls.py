from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotifikasiViewSet

router = DefaultRouter()
router.register(r'notifikasi', NotifikasiViewSet, basename='notifikasi')

urlpatterns = [
    path('', include(router.urls)),
]