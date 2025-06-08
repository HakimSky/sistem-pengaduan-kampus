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
from rest_framework.permissions import IsAdminUser, IsAuthenticated

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

class UserManagementViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    authentication_classes = [SessionAuthentication] # <--- GUNAKAN SESI UNTUK VIEWSET INI
    permission_classes = []    

    def get_queryset(self):
        # Mengambil semua user, bisa diurutkan atau difilter jika perlu
        # Contoh: mengecualikan admin yang sedang login dari daftar yang dikelola
        if self.request and self.request.user and self.request.user.is_authenticated:
             return User.objects.exclude(pk=self.request.user.pk).order_by('username')
        return User.objects.all().order_by('username') # Fallback

    @action(detail=True, methods=['patch'], url_path='toggle-active')
    def toggle_active(self, request, pk=None):
        user = self.get_object()
        # Tambahkan validasi agar admin tidak menonaktifkan diri sendiri jika perlu
        if user == request.user:
             return Response({'detail': 'Anda tidak dapat mengubah status aktif diri sendiri.'}, status=status.HTTP_400_BAD_REQUEST)

        user.is_active = not user.is_active
        user.save(update_fields=['is_active'])

        # Log aksi ini ke AdminManajemenAkun
        AdminManajemenAkun.objects.create(
            admin=request.user,
            user_yang_dikelola=user,
            aksi='Aktifkan Akun' if user.is_active else 'Nonaktifkan Akun',
            catatan_admin=f"Status akun diubah menjadi {'aktif' if user.is_active else 'nonaktif'}."
        )
        return Response(self.get_serializer(user).data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Tambahkan validasi agar admin tidak menghapus diri sendiri
        if instance == request.user:
             return Response({'detail': 'Anda tidak dapat menghapus akun diri sendiri.'}, status=status.HTTP_400_BAD_REQUEST)

        # Log aksi penghapusan
        AdminManajemenAkun.objects.create(
            admin=request.user,
            user_yang_dikelola=instance,
            aksi='Hapus Akun',
            catatan_admin=f"Akun {instance.username} dihapus."
        )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)