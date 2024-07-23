from django.contrib import admin
from django.urls import path, include
from pots_pal.views import ListDay, DayDetail, ListData, DataDetail, UserList, UserDetail

urlpatterns = [
    path('admin/', admin.site.urls),
    path('days/', ListDay.as_view(), name='list-days'),
    path('days/<int:pk>/', DayDetail.as_view(), name='day-detail'),
    path('data/', ListData.as_view(), name='list-data'),
    path('data/<int:pk>/', DataDetail.as_view(), name='data-detail'),
    path('users/', UserList.as_view(), name='user-list'), 
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),  
]
