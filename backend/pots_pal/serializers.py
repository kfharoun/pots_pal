from rest_framework import serializers
from .models import User, Day, Data

class DataSerializer(serializers.HyperlinkedModelSerializer):
    class Meta: 
        model = Data
        fields = ('id', 'meal_item', 'favorite_meal', 'water_intake', 'salt_intake', 'weather', 'low_heart_rate', 'high_heart_rate', 'activity')

class DaySerializer(serializers.HyperlinkedModelSerializer):
    data = DataSerializer(many=True)

    class Meta: 
        model = Day
        fields = ('id', 'date', 'good_day', 'neutral_day', 'nauseous', 'fainting', 'bed_bound', 'data')

class UserSerializer(serializers.HyperlinkedModelSerializer):
    days = DaySerializer(many=True)

    class Meta:
        model = User
        fields = ('id','username', 'email', 'password', 'zip_code', 'days')

