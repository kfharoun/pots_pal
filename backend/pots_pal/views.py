from rest_framework import generics, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import CustomUser, Day, Data, Favorite
from .serializers import UserSerializer, DaySerializer, DataSerializer, FavoriteSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .utils import CustomTokenObtainPairSerializer

class UserList(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Allow anyone to create a user

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
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

class FavoriteList(generics.ListCreateAPIView):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

class FavoriteDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

class ListData(generics.ListCreateAPIView):
    queryset = Data.objects.all()
    serializer_class = DataSerializer
    permission_classes = [IsAuthenticated]

class DataDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Data.objects.all()
    serializer_class = DataSerializer
    permission_classes = [IsAuthenticated]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

import requests
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
import os
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