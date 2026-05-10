from django.urls import path
from .views import PredictCropView, RecommendationHistoryView

urlpatterns = [
    path('predict/', PredictCropView.as_view(), name='predict-crop'),
    path('history/', RecommendationHistoryView.as_view(), name='recommendation-history'),
]
