# Generated by Django 5.0.7 on 2024-07-25 13:26

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pots_pal', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='data',
            name='meal_item',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=100), size=10),
        ),
    ]
