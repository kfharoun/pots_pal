from rest_framework import serializers
from .models import CustomUser, Day, Data, Favorite

class FavoriteSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        read_only=True
    )

    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        source='user'
    )

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'user_id', 'food_items', 'activity_items']

class DataSerializer(serializers.HyperlinkedModelSerializer):
    day = serializers.HyperlinkedRelatedField(
        view_name='day-detail',
        read_only=True
    )

    day_id = serializers.PrimaryKeyRelatedField(
        queryset=Day.objects.all(),
        source='day'
    )

    class Meta:
        model = Data
        fields = ['id', 'day', 'day_id', 'meal_item', 'favorite_meal', 'water_intake', 'salt_intake', 'weather', 'low_heart_rate', 'high_heart_rate', 'activity_item', 'favorite_activity']

class DaySerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HyperlinkedRelatedField(
        view_name='user-detail',
        read_only=True
    )

    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        source='user'
    )

    data = DataSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Day
        fields = ['id', 'user', 'user_id', 'date', 'good_day', 'neutral_day', 'nauseous', 'fainting', 'bed_bound', 'data']

class UserSerializer(serializers.HyperlinkedModelSerializer):
    days = DaySerializer(
        many=True,
        read_only=True
    )

    favorite = FavoriteSerializer(
        read_only=True
    )

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'auth0_id', 'favorite', 'days']