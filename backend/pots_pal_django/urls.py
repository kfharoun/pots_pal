from django.urls import path
from django.contrib import admin
from pots_pal.views import ListUser, UserDetail, ListDay, DayDetail, ListData, DataDetail

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', ListUser.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('days/', ListDay.as_view(), name='day-list'),
    path('days/<int:pk>/', DayDetail.as_view(), name='day-detail'),
    path('days/<int:day_id>/data/', ListData.as_view(), name='data-list'),
    path('data/<int:pk>/', DataDetail.as_view(), name='data-detail'),
]
