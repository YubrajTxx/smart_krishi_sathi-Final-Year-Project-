from django.contrib import admin
from .models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('subject', 'full_name', 'email', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('subject', 'full_name', 'email', 'message')
    readonly_fields = ('created_at',)
