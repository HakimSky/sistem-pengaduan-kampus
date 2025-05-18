from rest_framework.routers import DefaultRouter
from .views import WargaKampusViewSet
from django.urls import path, include
from .views import ProfileView

router = DefaultRouter()
router.register(r'warga-kampus', WargaKampusViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', ProfileView.as_view(), name='profile'),
]