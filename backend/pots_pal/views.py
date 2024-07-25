import os
import requests
from django.http import JsonResponse
from rest_framework import status, viewsets, generics
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