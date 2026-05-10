from django.urls import path
from .views import LocationStatView

urlpatterns = [
    path('stats/', LocationStatView.as_view(), name='location-stats'),
]
