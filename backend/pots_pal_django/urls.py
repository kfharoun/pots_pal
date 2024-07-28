from django.contrib import admin
from django.urls import path
from pots_pal.views import (
    ListDay, DayDetail, ListData, DataDetail, UserList, UserDetail,
    FavoriteList, FavoriteDetail, CustomTokenObtainPairView, GetUserByUsernameView, DataByUsernameView, DaysByUsernameView, signup, DayUpdateByUsernameView, DataUpdateByUsernameView, DayByUsernameDateView, AggregateDataByMoodView, FavoriteMealItemView, FavoriteActivityItemView, FavoriteItemView, DataByDateView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('days/', ListDay.as_view(), name='list-days'),
    path('days/<int:pk>/', DayDetail.as_view(), name='day-detail'),
    # update and create by username
    path('days/<str:username>/', DaysByUsernameView.as_view(), name='days-by-username'),
    path('days/<str:username>/<int:pk>/', DayUpdateByUsernameView.as_view(), name='day-update-by-username'),
    path('days/<str:username>/<str:date>/', DayByUsernameDateView.as_view(), name='day-username-view' ),

    path('data/', ListData.as_view(), name='list-data'),
    path('data/<int:pk>/', DataDetail.as_view(), name='data-detail'),
    # update and create by username
    path('data/<str:username>/', DataByUsernameView.as_view(), name='data-by-username'),
    path('data/<str:username>/date/<str:date>/', DataByDateView.as_view(), name='data-by-date'),
    path('data/<str:username>/<int:pk>/', DataUpdateByUsernameView.as_view(), name='data-update-by-username'),
    
    path('users/', UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('users/<str:username>/', GetUserByUsernameView.as_view()),

  

    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/signup', signup),

    path('days/<str:username>/aggregate/<str:mood>/', AggregateDataByMoodView.as_view(), name='aggregate-data-by-mood'),
    path('favorites/meal/<str:username>/', FavoriteMealItemView.as_view(), name='favorite-meal'),
    path('favorites/activity/<str:username>/', FavoriteActivityItemView.as_view(), name='favorite-activity'),
    path('favorites/<str:username>/', FavoriteItemView.as_view(), name='favorite-item-detail'),
    path('favs/', FavoriteList.as_view(), name='favorite-list'),
    path('favs/<int:pk>/', FavoriteDetail.as_view(), name='favorite-detail'),
]