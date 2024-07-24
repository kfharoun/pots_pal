from django.contrib import admin
from django.urls import path
from pots_pal.views import (
    ListDay, DayDetail, ListData, DataDetail, UserList, UserDetail,
    FavoriteList, FavoriteDetail, CustomTokenObtainPairView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('days/', ListDay.as_view(), name='list-days'),
    path('days/<int:pk>/', DayDetail.as_view(), name='day-detail'),
    path('data/', ListData.as_view(), name='list-data'),
    path('data/<int:pk>/', DataDetail.as_view(), name='data-detail'),
    path('users/', UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('favs/', FavoriteList.as_view(), name='favorite-list'),
    path('favs/<int:pk>/', FavoriteDetail.as_view(), name='favorite-detail'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]