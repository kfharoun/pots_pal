from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser, Day, Data
from .serializers import UserSerializer, DaySerializer, DataSerializer

class UserList(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class UserDetail(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
  

class ListDay(generics.ListCreateAPIView):
    queryset = Day.objects.all()
    serializer_class = DaySerializer
    permission_classes = [IsAuthenticated]

class DayDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Day.objects.all()
    serializer_class = DaySerializer
    permission_classes = [IsAuthenticated]

class ListData(generics.ListCreateAPIView):
    queryset = Data.objects.all()
    serializer_class = DataSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        favorite_meal_items = serializer.validated_data.get('favorite_meal_item', [])
        if serializer.validated_data.get('favorite_meal') and not favorite_meal_items:
            raise serializers.ValidationError("Favorite meal items must be provided if a meal is marked as favorite.")
        serializer.save()

class DataDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Data.objects.all()
    serializer_class = DataSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        favorite_meal_items = serializer.validated_data.get('favorite_meal_item', [])
        if serializer.validated_data.get('favorite_meal') and not favorite_meal_items:
            raise serializers.ValidationError("Favorite meal items must be provided if a meal is marked as favorite.")
        serializer.save()