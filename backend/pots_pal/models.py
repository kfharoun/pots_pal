from django.db import models
from django.core.validators import RegexValidator
from django.contrib.postgres.fields import ArrayField

class User(models.Model):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=10)
    zip_code = models.CharField(
        max_length=10,
        validators=[
            RegexValidator(
                regex=r'^\d{5}(?:-\d{4})?$',
                message='Enter a valid zip code in the format XXXXX or XXXXX-XXXX.'
            )
        ]
    )
    password = models.CharField(max_length=255) 

    def __str__(self):
        return self.username

class Day(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='days')
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
    meal_item = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    favorite_meal = models.BooleanField(default=False)
    water_intake = models.IntegerField(default=0)
    salt_intake = models.IntegerField(default=0)
    weather = models.CharField(max_length=200)
    low_heart_rate = models.IntegerField(default=0)
    high_heart_rate = models.IntegerField(default=0)
    activity = models.BooleanField(default=False)

    class Meta:
        db_table = 'data'

    def __str__(self):
        return f"Data for {self.day.date}"
