from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/crops/', include('apps.crops.urls')),
    path('api/recommendations/', include('apps.recommendations.urls')),
    path('api/weather/', include('apps.weather.urls')),
    path('api/learn/', include('apps.learn.urls')),
    path('api/map/', include('apps.mapdata.urls')),
    path('api/activities/', include('apps.activities.urls')),
    path('api/notes/', include('apps.notes.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/support/', include('apps.support.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
