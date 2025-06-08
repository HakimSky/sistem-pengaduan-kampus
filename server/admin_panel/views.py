from rest_framework import viewsets
from .models import AdminVerifikasi, AdminManajemenAkun
from .serializers import AdminVerifikasiSerializer, AdminManajemenAkunSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework import permissions, status
from rest_framework.decorators import action
from .serializers import UserSerializer
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
import logging

class AdminVerifikasiViewSet(viewsets.ModelViewSet):
    queryset = AdminVerifikasi.objects.all()
    serializer_class = AdminVerifikasiSerializer

class AdminManajemenAkunViewSet(viewsets.ModelViewSet):
    queryset = AdminManajemenAkun.objects.all()
    serializer_class = AdminManajemenAkunSerializer

class AdminUserStats(APIView):
    def get(self, request):
        users = User.objects.all()
        print("Semua user:", [u.username for u in users])

        total_admin = users.filter(username="admin").count()
        total_pihak = users.filter(username__startswith="ums_").count()
        total_warga = users.exclude(username="admin").exclude(username__startswith="ums_").count()

        print("Total admin:", total_admin)
        print("Total pihak:", total_pihak)
        print("Total warga:", total_warga)

        return Response({
            "admin": total_admin,
            "pihak": total_pihak,
            "warga": total_warga,
        })

logger = logging.getLogger(__name__)

class UserManagementViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [AllowAny]  # Sementara pake AllowAny

    def get_queryset(self):
        if self.request and hasattr(self.request, 'user') and self.request.user.is_authenticated:
            logger.info(f"User {self.request.user.username} authenticated, Session: {self.request.session.session_key}")
            return User.objects.exclude(pk=self.request.user.pk).order_by('username')
        logger.warning("No authentication or session found")
        return User.objects.all().order_by('username')

    @action(detail=True, methods=['patch'], url_path='toggle-active')
    def toggle_active(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        AdminManajemenAkun.objects.create(
            admin=request.user if request.user.is_authenticated else None,
            user_yang_dikelola=user,
            aksi='Aktifkan Akun' if user.is_active else 'Nonaktifkan Akun',
            catatan_admin=f"Status akun diubah menjadi {'aktif' if user.is_active else 'nonaktif'}."
        )
        return Response(self.get_serializer(user).data)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            logger.info(f"Instance sebelum hapus: {instance}, ID: {instance.id if instance else 'None'}")
            if not instance or instance.id is None:
                logger.error(f"Instance invalid or ID None: {instance}")
                return Response(
                    {'detail': 'Data user tidak valid, ID tidak ditemukan.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            logger.info(f"Admin {request.user.username if request.user.is_authenticated else 'anonymous'} akan hapus akun {instance.username}")
            AdminManajemenAkun.objects.create(
                admin=request.user if request.user.is_authenticated else None,
                user_yang_dikelola=instance,
                aksi='Hapus Akun',
                catatan_admin=f"Akun {instance.username} (ID: {instance.pk}) dihapus."
            )
            self.perform_destroy(instance)
            logger.info(f"Akun {instance.username} berhasil dihapus")
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            logger.error(f"User dengan ID {self.kwargs['pk']} tidak ditemukan")
            return Response(
                {'detail': 'User tidak ditemukan.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Gagal hapus akun {instance.username if instance else 'unknown'}: {str(e)}")
            return Response(
                {'detail': f'Gagal menghapus akun: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )