from django.contrib import admin
from .models import Crop, CropGuide

class CropGuideInline(admin.StackedInline):
    model = CropGuide
    extra = 1

class CropAdmin(admin.ModelAdmin):
    inlines = [CropGuideInline]
    list_display = ('crop_name_en', 'season', 'water_requirement')

admin.site.register(Crop, CropAdmin)
admin.site.register(CropGuide)
