from django.contrib import admin
from .models import CustomUser, Day, Data, Favorite

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'auth0_id', 'is_active', 'is_admin')
    search_fields = ('email', 'username')
    list_filter = ('is_active', 'is_admin')

@admin.register(Day)
class DayAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'good_day', 'neutral_day', 'nauseous', 'fainting', 'bed_bound')
    search_fields = ('user__username', 'date')
    list_filter = ('good_day', 'neutral_day', 'nauseous', 'fainting', 'bed_bound')

@admin.register(Data)
class DataAdmin(admin.ModelAdmin):
    list_display = ('day', 'favorite_meal', 'water_intake', 'salt_intake', 'weather', 'low_heart_rate', 'high_heart_rate', 'favorite_activity')
    search_fields = ('day__date', 'day__user__username')
    list_filter = ('favorite_meal', 'favorite_activity')

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'food_items', 'activity_items')
    search_fields = ('user__username', 'food_items', 'activity_items')