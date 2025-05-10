from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('rest_framework.urls')),
    path('api/token-auth/', views.obtain_auth_token),
    
    path('api/warga-kampus/', include('warga_kampus.urls')),
    path('api/pihak-kampus/', include('pihak_kampus.urls')),
    path('api/pengaduan/', include('pengaduan.urls')),
    path('api/admin-area/', include('admin_area.urls')),
    path('api/feedback/', include('feedback.urls')),
]