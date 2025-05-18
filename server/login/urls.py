from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterViewSet
from .views import LoginView, LogoutView, ChangePasswordView

router = DefaultRouter()
router.register(r'register', RegisterViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]

