from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, auth0_id=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not auth0_id:
            raise ValueError('The Auth0 ID must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, auth0_id=auth0_id, **extra_fields)
        user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, auth0_id=None, **extra_fields):
        extra_fields.setdefault('is_admin', True)
        return self.create_user(email, username, auth0_id=auth0_id, **extra_fields)

class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    auth0_id = models.CharField(max_length=64, unique=True, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'customuser'

    def __str__(self):
        return self.username

class Favorite(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='favorite')
    food_items = ArrayField(models.CharField(max_length=100), blank=True, default=list)
    activity_items = ArrayField(models.CharField(max_length=100), blank=True, default=list)

    class Meta:
        db_table = 'favorite'
    
    def __str__(self):
        return f"{self.user}'s favorites"

class Day(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='days')
    date = models.DateField(null=True, blank=True)
    good_day = models.BooleanField(default=False)
    neutral_day = models.BooleanField(default=False)
    nauseous = models.BooleanField(default=False)
    fainting = models.BooleanField(default=False)
    bed_bound = models.BooleanField(default=False)

    class Meta:
        db_table = 'days'

    def __str__(self):
        return str(self.date)

class Data(models.Model):
    day = models.ForeignKey(Day, on_delete=models.CASCADE, related_name='data')
    meal_item = ArrayField(models.CharField(max_length=100, blank=True), size=10)
    favorite_meal = models.BooleanField(default=False)
    water_intake = models.IntegerField(default=0)
    salt_intake = models.IntegerField(default=0)
    weather = models.IntegerField(default=0)
    low_heart_rate = models.IntegerField(default=0)
    high_heart_rate = models.IntegerField(default=0)
    activity_item = ArrayField(models.CharField(max_length=100, blank=True), size=10)
    favorite_activity = models.BooleanField(default=False)

    class Meta:
        db_table = 'data'

    def __str__(self):
        return f"Data for {self.day.date}"