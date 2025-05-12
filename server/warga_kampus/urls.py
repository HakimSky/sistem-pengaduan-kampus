from rest_framework.routers import DefaultRouter
from .views import WargaKampusViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'warga-kampus', WargaKampusViewSet)

urlpatterns = [
    path('', include(router.urls)),
]