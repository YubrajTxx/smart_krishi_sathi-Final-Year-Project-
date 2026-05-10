from django.contrib import admin
from .models import LocationStat

@admin.register(LocationStat)
class LocationStatAdmin(admin.ModelAdmin):
    list_display = ('district', 'province', 'land_type', 'avg_temp', 'avg_rainfall')
    list_filter = ('province', 'land_type')
    search_fields = ('district', 'province')
