from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterViewSet
from .views import LoginView, LogoutView, ChangePasswordView, PasswordResetRequestView, PasswordResetConfirmView

router = DefaultRouter()
router.register(r'register', RegisterViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    # Untuk alur lupa password
    path('password-reset-request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]

