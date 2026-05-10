from rest_framework import viewsets, permissions
from .models import LocationStat
from rest_framework.views import APIView
from rest_framework.response import Response

class LocationStatView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        stats = LocationStat.objects.all().values()
        return Response(stats)
