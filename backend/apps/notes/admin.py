from django.contrib import admin
from .models import Note

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'tag', 'created_at')
    list_filter = ('tag', 'created_at')
    search_fields = ('title', 'content', 'user__email', 'user__username')
