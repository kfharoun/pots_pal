
from django.contrib import admin
from .models import CustomUser, Day, Data

admin.site.register(CustomUser)
admin.site.register(Day)
admin.site.register(Data)