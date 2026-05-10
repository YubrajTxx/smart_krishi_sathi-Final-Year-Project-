import os
import pickle
import warnings
import numpy as np
import pandas as pd

from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.conf import settings

from .serializers import PredictionInputSerializer, RecommendationLogSerializer
from .models import RecommendationLog

# ── Load AI artefacts once at module level ────────────────────────────────────
AI_DIR = os.path.join(settings.BASE_DIR, 'ai')

with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    with open(os.path.join(AI_DIR, 'model.pkl'), 'rb') as f:
        _MODEL = pickle.load(f)
    with open(os.path.join(AI_DIR, 'label_encoder.pkl'), 'rb') as f:
        _LE = pickle.load(f)
    with open(os.path.join(AI_DIR, 'ordinal_encoder.pkl'), 'rb') as f:
        _OE = pickle.load(f)

# Feature order MUST match training
_FEATURE_COLS = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall',
                 'zone', 'season', 'irrigation', 'soil_type']
_CAT_COLS = ['zone', 'season', 'irrigation', 'soil_type']

# Crop descriptions (shown on result cards)
_CROP_INFO = {
    'rice':        'Thrives in humid, waterlogged conditions with high rainfall.',
    'maize':       'Versatile crop; grows well in warm climates with moderate rain.',
    'wheat':       'Cool-season crop suited for well-drained fertile soils.',
    'chickpea':    'Drought-tolerant legume ideal for semi-arid regions.',
    'kidneybeans': 'Prefers loamy soil and moderate humidity with good drainage.',
    'pigeonpeas':  'Hardy legume well-suited to tropical and subtropical climates.',
    'mothbeans':   'Highly drought-resistant; thrives in arid, sandy soils.',
    'mungbean':    'Short-duration crop needing warm weather and moderate moisture.',
    'blackgram':   'Grows best in tropical climates with moderate rainfall.',
    'lentil':      'Cool-season legume perfect for well-drained medium soils.',
    'pomegranate': 'Tolerates drought; grows best in semi-arid warm climates.',
    'banana':      'Requires tropical heat, high humidity, and rich moist soil.',
    'mango':       'Tropical tree crop thriving in hot, dry spells before flowering.',
    'grapes':      'Best in warm, dry summers with well-drained loamy soil.',
    'watermelon':  'Needs long warm season with sandy soil and moderate water.',
    'muskmelon':   'Thrives in dry heat with light sandy soil and good drainage.',
    'apple':       'Requires cool temperate climate with adequate winter chilling.',
    'orange':      'Grows well in subtropical climate with well-drained soil.',
    'papaya':      'Tropical crop requiring warmth, sunshine, and rich moist soil.',
    'coconut':     'Coastal crop; needs tropical heat, humidity, and sandy soil.',
    'cotton':      'Warm-season crop; thrives in black cotton soil with low rain.',
    'coffee':      'Grown in cool tropics with rich humid soil and shade cover.',
    'jute':        'Requires hot, humid climate with high rainfall and alluvial soil.',
}


def _predict_top3(data: dict) -> list:
    """Run inference and return top-3 crops with confidence %."""
    row = {
        'N': data['nitrogen'],
        'P': data['phosphorus'],
        'K': data['potassium'],
        'temperature': data['temperature'],
        'humidity': data['humidity'],
        'ph': data['ph'],
        'rainfall': data['rainfall'],
        'zone': data['zone'],
        'season': data['season'],
        'irrigation': data['irrigation'],
        'soil_type': data['soil_type'],
    }

    df = pd.DataFrame([row])

    # Ordinal-encode categoricals (same transform as training)
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        df[_CAT_COLS] = _OE.transform(df[_CAT_COLS])

    # XGBoost multi:softmax gives a single class, so use predict_proba for ranking
    proba = _MODEL.predict_proba(df[_FEATURE_COLS])[0]

    top3_idx = np.argsort(proba)[::-1][:3]
    results = []
    for rank, idx in enumerate(top3_idx, start=1):
        crop = _LE.inverse_transform([idx])[0]
        confidence = round(float(proba[idx]) * 100, 1)
        results.append({
            'rank': rank,
            'crop': crop.capitalize(),
            'prob': confidence,
            'desc': _CROP_INFO.get(crop, 'Suitable based on provided soil and climate data.'),
        })
    return results


# ── Views ─────────────────────────────────────────────────────────────────────

class PredictCropView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PredictionInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        try:
            recommendations = _predict_top3(data)
        except Exception as e:
            return Response(
                {'error': f'Prediction failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Save result to DB
        log = RecommendationLog.objects.create(
            user=request.user,
            nitrogen=data['nitrogen'],
            phosphorus=data['phosphorus'],
            potassium=data['potassium'],
            ph=data['ph'],
            temperature=data['temperature'],
            humidity=data['humidity'],
            rainfall=data['rainfall'],
            zone=data['zone'],
            season=data['season'],
            irrigation=data['irrigation'],
            soil_type=data['soil_type'],
            recommended_crops=recommendations,
        )

        return Response({
            'recommendations': recommendations,
            'log_id': log.id,
        }, status=status.HTTP_200_OK)


class RecommendationHistoryView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        logs = RecommendationLog.objects.filter(user=request.user)
        serializer = RecommendationLogSerializer(logs, many=True)
        return Response(serializer.data)
