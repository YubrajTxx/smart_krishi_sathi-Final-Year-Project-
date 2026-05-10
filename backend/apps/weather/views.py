from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import requests

class WeatherView(APIView):
    """
    Fetches real-time weather data for a given location.
    Uses Open-Meteo API (Free).
    """
    permission_classes = [AllowAny]

    def get(self, request):
        lat = request.query_params.get('lat', 27.7172) # Default Kathmandu
        lng = request.query_params.get('lng', 85.3240)
        
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,rain_sum&timezone=auto"
        
        try:
            response = requests.get(url)
            data = response.json()
            return Response(data)
        except Exception as e:
            return Response({'error': 'Failed to fetch weather data'}, status=500)
