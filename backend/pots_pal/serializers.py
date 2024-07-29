from rest_framework import serializers
from .models import CustomUser, Day, Data, Favorite

class FavoriteSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        slug_field='username',
        queryset=CustomUser.objects.all()
    )

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'food_items', 'activity_items']

class DataSerializer(serializers.ModelSerializer):
    day = serializers.SlugRelatedField(
        slug_field='id',
        queryset=Day.objects.all()
    )
    username = serializers.CharField(source='day.user.username', read_only=True)

    class Meta:
        model = Data
        fields = ['id', 'day', 'meal_item', 'favorite_meal', 'water_intake', 'salt_intake', 'weather', 'low_heart_rate', 'high_heart_rate', 'activity_item', 'favorite_activity', 'username']
        extra_kwargs = {
            'day': {'required': False},
            'meal_item': {'required': False},
            'activity_item': {'required': False},
        }
        def validate_meal_item(self, value):
            if value is None:
                return []
            return value

        def validate_activity_item(self, value):
            if value is None:
                return []
            return value
class DaySerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        slug_field='username',
        queryset=CustomUser.objects.all(),
        required=False
    )

    data = DataSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Day
        fields = ['id', 'user', 'date', 'good_day', 'neutral_day', 'nauseous', 'fainting', 'bed_bound', 'data']


class UserSerializer(serializers.ModelSerializer):
    days = DaySerializer(
        many=True,
        read_only=True
    )

    favorite = FavoriteSerializer(
        read_only=True
    )

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'auth0_id', 'password', 'favorite', 'days']