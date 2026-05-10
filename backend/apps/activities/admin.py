from django.contrib import admin
from .models import Activity

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('type', 'crop', 'user', 'date', 'status')
    list_filter = ('type', 'status', 'date')
    search_fields = ('crop', 'user__email', 'user__username')
