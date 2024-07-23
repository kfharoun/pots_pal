from rest_framework import serializers
from .models import CustomUser, Day, Data

class DataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Data
        fields = ['id', 'meal_item', 'favorite_meal', 'favorite_meal_item', 'water_intake', 'salt_intake', 'weather', 'low_heart_rate', 'high_heart_rate', 'activity']

    def validate_favorite_meal_item(self, value):
        if value:
            user = self.instance.day.user if self.instance else self.context['request'].user
            existing_favorites = Data.objects.filter(day__user=user, favorite_meal_item__overlap=value).exists()
            if existing_favorites:
                raise serializers.ValidationError("This favorite meal item already exists for the user.")
        return value

    def validate(self, data):
        if data.get('favorite_meal') and not data.get('favorite_meal_item'):
            raise serializers.ValidationError("Favorite meal items must be provided if a meal is marked as favorite.")
        return data
    
class DaySerializer(serializers.ModelSerializer):
    data = DataSerializer(many=True, read_only=True)

    class Meta:
        model = Day
        fields = ['id', 'date', 'good_day', 'neutral_day', 'nauseous', 'fainting', 'bed_bound', 'data']

class UserSerializer(serializers.ModelSerializer):
    days = DaySerializer(many=True, read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'auth0_id', 'days']