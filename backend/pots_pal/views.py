import os
import requests
from django.http import JsonResponse
from django.db.models import Q 
from collections import defaultdict, Counter
from datetime import timedelta, datetime
from rest_framework.views import APIView
from rest_framework import status, viewsets, generics
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import CustomUser, Day, Data, Favorite
from .serializers import UserSerializer, DaySerializer, DataSerializer, FavoriteSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .utils import CustomTokenObtainPairSerializer
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

AUTH0_DOMAIN = os.getenv('AUTH0_DOMAIN')
AUTH0_CLIENT_ID = os.getenv('AUTH0_CLIENT_ID')
AUTH0_CLIENT_SECRET = os.getenv('AUTH0_CLIENT_SECRET')
AUTH0_CONNECTION = os.getenv('AUTH0_CONNECTION')

def get_auth0_token():
    url = f'https://{AUTH0_DOMAIN}/oauth/token'
    headers = {'content-type': 'application/json'}
    payload = {
        'client_id': AUTH0_CLIENT_ID,
        'client_secret': AUTH0_CLIENT_SECRET,
        'audience': f'https://{AUTH0_DOMAIN}/api/v2/',
        'grant_type': 'client_credentials'
    }
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    return response.json()['access_token']

@api_view(['POST'])
@permission_classes([AllowAny])
def sync_user(request):
    email = request.data.get('email')
    username = request.data.get('username')
    auth0_id = request.data.get('auth0_id')

    if not email or not auth0_id:
        return JsonResponse({'error': 'Email and Auth0 ID are required'}, status=status.HTTP_400_BAD_REQUEST)

    user, created = CustomUser.objects.get_or_create(
        email=email,
        defaults={'username': username, 'auth0_id': auth0_id}
    )

    if not created:
        user.username = username
        user.auth0_id = auth0_id
        user.save()

    serializer = UserSerializer(user)
    return JsonResponse(serializer.data, status=status.HTTP_200_OK)


class UserList(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny] 

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny] 
    # permission_classes = [IsAuthenticated]

class ListDay(generics.ListCreateAPIView):
    queryset = Day.objects.all()
    serializer_class = DaySerializer
    permission_classes = [AllowAny] 
    # permission_classes = [IsAuthenticated]

class DayDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Day.objects.all()
    serializer_class = DaySerializer
    permission_classes = [AllowAny] 
    # permission_classes = [IsAuthenticated]

class FavoriteList(generics.ListCreateAPIView):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer
    permission_classes = [AllowAny] 
    # permission_classes = [IsAuthenticated]

class FavoriteDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer
    permission_classes = [AllowAny] 
    # permission_classes = [IsAuthenticated]

class ListData(generics.ListCreateAPIView):
    queryset = Data.objects.all()
    serializer_class = DataSerializer
    permission_classes = [AllowAny] 
    # permission_classes = [IsAuthenticated]

class DataDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Data.objects.all()
    serializer_class = DataSerializer
    permission_classes = [AllowAny]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class GetUserByUsernameView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny] 
    def get(self, request, username):
        try:
            user = CustomUser.objects.get(username__iexact=username)
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'That User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DaysByUsernameView(generics.ListCreateAPIView):
    serializer_class = DaySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        username = self.kwargs['username']
        return Day.objects.filter(user__username__iexact=username)

    def perform_create(self, serializer):
        username = self.kwargs['username']
        user = get_object_or_404(CustomUser, username=username)
        serializer.save(user=user)

    def put(self, request, username, pk):
        user = get_object_or_404(CustomUser, username=username)
        day = get_object_or_404(Day, pk=pk, user=user)
        serializer = DaySerializer(day, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DataByUsernameView(generics.ListCreateAPIView):
    queryset = Data.objects.all()
    serializer_class = DataSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        username = self.kwargs['username']
        return Data.objects.filter(day__user__username__iexact=username)

    def perform_create(self, serializer):
        username = self.kwargs['username']
        day_id = self.request.data.get('day')
        user = get_object_or_404(CustomUser, username=username)
        day = get_object_or_404(Day, id=day_id, user=user)
        serializer.save(day=day)

    def put(self, request, username, pk):
        user = get_object_or_404(CustomUser, username=username)
        data_entry = get_object_or_404(Data, pk=pk, day__user=user)
        serializer = DataSerializer(data_entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DayUpdateByUsernameView(generics.RetrieveUpdateAPIView):
    serializer_class = DaySerializer
    permission_classes = [AllowAny]

    def get_object(self):
        username = self.kwargs['username']
        pk = self.kwargs['pk']
        user = get_object_or_404(CustomUser, username=username)
        return get_object_or_404(Day, pk=pk, user=user)

    def perform_update(self, serializer):
        username = self.kwargs['username']
        user = get_object_or_404(CustomUser, username=username)
        serializer.save(user=user)

class DayByUsernameDateView(generics.ListCreateAPIView):
    serializer_class = DaySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        username = self.kwargs['username']
        date = self.kwargs['date']
        return Day.objects.filter(user__username__iexact=username, date=date)

    def perform_create(self, serializer):
        username = self.kwargs['username']
        date = self.kwargs['date']
        user = get_object_or_404(CustomUser, username=username)
        day, created = Day.objects.get_or_create(user=user, date=date)
        serializer.save(user=user, date=date)

    def get(self, request, *args, **kwargs):
        username = self.kwargs['username']
        date = self.kwargs['date']
        user = get_object_or_404(CustomUser, username=username)
        day = Day.objects.filter(user=user, date=date).first()
        if day:
            serializer = DaySerializer(day)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        username = self.kwargs['username']
        date = self.kwargs['date']
        user = get_object_or_404(CustomUser, username=username)
        day = get_object_or_404(Day, user=user, date=date)
        serializer = DaySerializer(day, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DataUpdateByUsernameView(generics.RetrieveUpdateAPIView):
    serializer_class = DataSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        username = self.kwargs['username']
        pk = self.kwargs['pk']
        user = get_object_or_404(CustomUser, username=username)
        return get_object_or_404(Data, pk=pk, day__user=user)

    def perform_update(self, serializer):
        username = self.kwargs['username']
        day_id = serializer.validated_data.get('day').id
        user = get_object_or_404(CustomUser, username=username)
        day = get_object_or_404(Day, id=day_id, user=user)
        serializer.save(day=day)

class AggregateDataByMoodView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username, mood):
        user = get_object_or_404(CustomUser, username=username)

        if mood == 'good_day':
            days = Day.objects.filter(user=user, good_day=True)
        elif mood == 'neutral_day':
            days = Day.objects.filter(user=user, neutral_day=True)
        elif mood == 'bad_day':
            days = Day.objects.filter(user=user).filter(
                Q(nauseous=True) | Q(fainting=True) | Q(bed_bound=True)
            )
        else:
            return Response({'detail': 'Invalid mood'}, status=status.HTTP_400_BAD_REQUEST)

        day_dates = days.values_list('date', flat=True)
        days_before = Day.objects.filter(user=user, date__in=[date - timedelta(days=1) for date in day_dates])

        data = Data.objects.filter(day__in=days)
        data_before = Data.objects.filter(day__in=days_before)

        def round_to_nearest_5(value):
            return 5 * round(value / 5)

        def aggregate_data(data_set):
            result = {
                'meal_items': Counter(),
                'activity_items': Counter(),
                'water_intake': 0,
                'salt_intake': 0,
                'weather': Counter(),
                'low_heart_rate': Counter(),
                'high_heart_rate': Counter()
            }
            weather_values = defaultdict(list)
            low_heart_rate_values = defaultdict(list)
            high_heart_rate_values = defaultdict(list)

            for entry in data_set:
                result['meal_items'].update(entry.meal_item)
                result['activity_items'].update(entry.activity_item)
                result['water_intake'] += entry.water_intake
                result['salt_intake'] += entry.salt_intake

                rounded_weather = round_to_nearest_5(entry.weather)
                weather_values[rounded_weather].append(entry.weather)

                rounded_low_hr = round_to_nearest_5(entry.low_heart_rate)
                low_heart_rate_values[rounded_low_hr].append(entry.low_heart_rate)

                rounded_high_hr = round_to_nearest_5(entry.high_heart_rate)
                high_heart_rate_values[rounded_high_hr].append(entry.high_heart_rate)

            for key, values in weather_values.items():
                avg_weather = sum(values) / len(values)
                result['weather'][key] = avg_weather

            for key, values in low_heart_rate_values.items():
                avg_low_hr = sum(values) / len(values)
                result['low_heart_rate'][key] = avg_low_hr

            for key, values in high_heart_rate_values.items():
                avg_high_hr = sum(values) / len(values)
                result['high_heart_rate'][key] = avg_high_hr

            result['meal_items'] = {k: v for k, v in result['meal_items'].items() if v >= 3}
            result['activity_items'] = {k: v for k, v in result['activity_items'].items() if v >= 3}
            result['weather'] = {k: v for k, v in result['weather'].items() if len(weather_values[k]) >= 3}
            result['low_heart_rate'] = {k: v for k, v in result['low_heart_rate'].items() if len(low_heart_rate_values[k]) >= 3}
            result['high_heart_rate'] = {k: v for k, v in result['high_heart_rate'].items() if len(high_heart_rate_values[k]) >= 3}

            return result

        aggregated_data = {
            'total_entries': data.count(),
            'current_day': aggregate_data(data),
            'day_before': aggregate_data(data_before)
        }

        return Response(aggregated_data)
    
class DataByDateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username, date):
        user = get_object_or_404(CustomUser, username=username)
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        data = Data.objects.filter(day__user=user, day__date=date_obj).first()
        if not data:
            return Response({"detail": "Data not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = DataSerializer(data)
        return Response(serializer.data)
class FavoriteMealItemView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        user = get_object_or_404(CustomUser, username=username)
        favorites = Favorite.objects.filter(user=user).values('food_items')
        return Response({"food_items": favorites[0]["food_items"] if favorites else []})

    def post(self, request, username):
        user = get_object_or_404(CustomUser, username=username)
        item = request.data.get('item')
        if not item:
            return Response({"detail": "Item is required"}, status=status.HTTP_400_BAD_REQUEST)

        favorite = Favorite.objects.filter(user=user).first()
        if not favorite:
            favorite = Favorite(user=user, food_items=[item])
        else:
            if item in favorite.food_items:
                return Response({"detail": "Already in favorites"}, status=status.HTTP_400_BAD_REQUEST)
            favorite.food_items.append(item)
        favorite.save()
        return Response({"detail": "Added to favorites"}, status=status.HTTP_201_CREATED)

    def put(self, request, username):
        user = get_object_or_404(CustomUser, username=username)
        item = request.data.get('item')
        if not item:
            return Response({"detail": "Item is required"}, status=status.HTTP_400_BAD_REQUEST)

        favorite = get_object_or_404(Favorite, user=user)
        if item not in favorite.food_items:
            favorite.food_items.append(item)
        favorite.save()
        return Response({"detail": "Favorite updated"}, status=status.HTTP_200_OK)

    def patch(self, request, username):
        user = get_object_or_404(CustomUser, username=username)
        item = request.data.get('item')
        if not item:
            return Response({"detail": "Item is required"}, status=status.HTTP_400_BAD_REQUEST)

        favorite = get_object_or_404(Favorite, user=user)
        if item not in favorite.food_items:
            favorite.food_items.append(item)
        favorite.save()
        return Response({"detail": "Favorite partially updated"}, status=status.HTTP_200_OK)

    def delete(self, request, username, pk):
        user = get_object_or_404(CustomUser, username=username)
        favorite = get_object_or_404(Favorite, id=pk, user=user)
        favorite.food_items.remove(pk)
        favorite.save()
        return Response({"detail": "Favorite removed"}, status=status.HTTP_204_NO_CONTENT)


class FavoriteActivityItemView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        user = get_object_or_404(CustomUser, username=username)
        favorites = Favorite.objects.filter(user=user).values('activity_items')
        return Response({"activity_items": favorites[0]["activity_items"] if favorites else []})

    def post(self, request, username):
        user = get_object_or_404(CustomUser, username=username)
        item = request.data.get('item')
        if not item:
            return Response({"detail": "Item is required"}, status=status.HTTP_400_BAD_REQUEST)

        favorite = Favorite.objects.filter(user=user).first()
        if not favorite:
            favorite = Favorite(user=user, activity_items=[item])
        else:
            if item in favorite.activity_items:
                return Response({"detail": "Already in favorites"}, status=status.HTTP_400_BAD_REQUEST)
            favorite.activity_items.append(item)
        favorite.save()
        return Response({"detail": "Added to favorites"}, status=status.HTTP_201_CREATED)

    def put(self, request, username):
        user = get_object_or_404(CustomUser, username=username)
        item = request.data.get('item')
        if not item:
            return Response({"detail": "Item is required"}, status=status.HTTP_400_BAD_REQUEST)

        favorite = get_object_or_404(Favorite, user=user)
        if item not in favorite.activity_items:
            favorite.activity_items.append(item)
        favorite.save()
        return Response({"detail": "Favorite updated"}, status=status.HTTP_200_OK)

    def patch(self, request, username):
        user = get_object_or_404(CustomUser, username=username)
        item = request.data.get('item')
        if not item:
            return Response({"detail": "Item is required"}, status=status.HTTP_400_BAD_REQUEST)

        favorite = get_object_or_404(Favorite, user=user)
        if item not in favorite.activity_items:
            favorite.activity_items.append(item)
        favorite.save()
        return Response({"detail": "Favorite partially updated"}, status=status.HTTP_200_OK)

    def delete(self, request, username, pk):
        user = get_object_or_404(CustomUser, username=username)
        favorite = get_object_or_404(Favorite, id=pk, user=user)
        favorite.activity_items.remove(pk)
        favorite.save()
        return Response({"detail": "Favorite removed"}, status=status.HTTP_204_NO_CONTENT)
    
class FavoriteItemView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        user = get_object_or_404(CustomUser, username=username)
        favorites_food = Favorite.objects.filter(user=user, food_items__isnull=False)
        favorites_activity = Favorite.objects.filter(user=user, activity_items__isnull=False)
        
        response_data = {
            'food_items': FavoriteSerializer(favorites_food, many=True).data,
            'activity_items': FavoriteSerializer(favorites_activity, many=True).data,
        }
        
        return Response(response_data)

    def post(self, request, username):
        user = get_object_or_404(CustomUser, username=username)
        food_item = request.data.get('food_item')
        activity_item = request.data.get('activity_item')
        
        if not food_item and not activity_item:
            return Response({"detail": "Food item or activity item is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if food_item:
            if Favorite.objects.filter(user=user, food_items=food_item).exists():
                return Response({"detail": "Already in favorites"}, status=status.HTTP_400_BAD_REQUEST)
            Favorite.objects.create(user=user, food_items=food_item)
        
        if activity_item:
            if Favorite.objects.filter(user=user, activity_items=activity_item).exists():
                return Response({"detail": "Already in favorites"}, status=status.HTTP_400_BAD_REQUEST)
            Favorite.objects.create(user=user, activity_items=activity_item)
        
        return Response({"detail": "Added to favorites"}, status=status.HTTP_201_CREATED)

    def put(self, request, username):
        user = get_object_or_404(CustomUser, username=username)
        favorite_id = request.data.get('id')
        food_item = request.data.get('food_item')
        activity_item = request.data.get('activity_item')
        
        if not favorite_id or (not food_item and not activity_item):
            return Response({"detail": "Favorite ID and item are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        favorite = get_object_or_404(Favorite, id=favorite_id, user=user)
        if food_item:
            favorite.food_items = food_item
        if activity_item:
            favorite.activity_items = activity_item
        favorite.save()
        
        return Response({"detail": "Favorite updated"}, status=status.HTTP_200_OK)

    def patch(self, request, username):
        user = get_object_or_404(CustomUser, username=username)
        favorite_id = request.data.get('id')
        food_item = request.data.get('food_item')
        activity_item = request.data.get('activity_item')
        
        if not favorite_id:
            return Response({"detail": "Favorite ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        favorite = get_object_or_404(Favorite, id=favorite_id, user=user)
        if food_item:
            favorite.food_items = food_item
        if activity_item:
            favorite.activity_items = activity_item
        favorite.save()
        
        return Response({"detail": "Favorite partially updated"}, status=status.HTTP_200_OK)
    
import requests
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
import os
from dotenv import load_dotenv

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    email = request.data.get('email')
    password = request.data.get('password')
    username = request.data.get('username')

    if not email or not password or not username:
        return JsonResponse({'error': 'Email, password, and username are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = get_auth0_token()
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': 'Could not obtain Auth0 token'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    payload = {
        "email": email,
        "password": password,
        "connection": AUTH0_CONNECTION,
        "username": username,
    }

    headers = {
        'Authorization': f'Bearer {token}',
        'content-type': 'application/json'
    }

    auth_response = requests.post(
        f'https://{AUTH0_DOMAIN}/api/v2/users',
        json=payload,
        headers=headers
    )

    if auth_response.status_code != 201:
        return JsonResponse({'error': 'Error creating user', 'details': auth_response.json()}, status=auth_response.status_code)

    return JsonResponse(auth_response.json(), status=status.HTTP_201_CREATED)