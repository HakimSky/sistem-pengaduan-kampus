from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny # Hanya gunakan AllowAny
from .models import Notifikasi
from .serializers import NotifikasiSerializer
from django.contrib.auth.models import User

class NotifikasiViewSet(viewsets.ModelViewSet):
    serializer_class = NotifikasiSerializer
    permission_classes = [AllowAny] # Izinkan semua akses, kita validasi secara manual

    def get_queryset(self):
        return Notifikasi.objects.none()

    def list(self, request, *args, **kwargs):
        user_id = request.query_params.get('user_id', None)
        if not user_id:
            return Response({"detail": "Parameter 'user_id' diperlukan."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            queryset = Notifikasi.objects.filter(penerima__user__id=user_id).order_by('-waktu_dikirim')
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except (ValueError, TypeError):
            return Response({"detail": "Parameter 'user_id' tidak valid."}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """
        Menandai satu notifikasi sebagai dibaca.
        Tidak lagi menggunakan IsAuthenticated. Keamanan berdasarkan user_id dari body.
        """
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({"detail": "user_id diperlukan di body request."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Cari notifikasi berdasarkan Primary Key (pk) DAN user_id pemiliknya.
            notif = Notifikasi.objects.get(pk=pk, penerima__user__id=user_id)
            if not notif.status_baca:
                notif.status_baca = True
                notif.save()
            return Response({'status': 'notification marked as read'}, status=status.HTTP_200_OK)
        except Notifikasi.DoesNotExist:
            return Response({'error': 'Notifikasi tidak ditemukan atau Anda tidak punya izin.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """
        Menandai semua notifikasi milik user sebagai dibaca.
        Tidak lagi menggunakan IsAuthenticated. Keamanan berdasarkan user_id dari body.
        """
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({"detail": "user_id diperlukan di body request."}, status=status.HTTP_400_BAD_REQUEST)

        # Filter notifikasi berdasarkan user_id dan yang belum dibaca, lalu update.
        queryset = Notifikasi.objects.filter(penerima__user__id=user_id, status_baca=False)
        updated_count = queryset.update(status_baca=True)
        return Response({'status': f'{updated_count} notifikasi ditandai terbaca'}, status=status.HTTP_200_OK)
