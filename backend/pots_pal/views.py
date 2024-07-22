from rest_framework import generics  
from .serializers import UserSerializer, DaySerializer, DataSerializer
from .models import User, Day, Data

# User
class ListUser(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Day
class ListDay(generics.ListCreateAPIView):
    queryset = Day.objects.all()
    serializer_class = DaySerializer

class DayDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Day.objects.all()
    serializer_class = DaySerializer

# Data
class ListData(generics.ListCreateAPIView):
    queryset = Data.objects.all()
    serializer_class = DataSerializer  

class DataDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Data.objects.all()
    serializer_class = DataSerializer