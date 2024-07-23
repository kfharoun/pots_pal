# Generated by Django 5.0.7 on 2024-07-23 01:11

import django.contrib.postgres.fields
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('username', models.CharField(max_length=150, unique=True)),
                ('auth0_id', models.CharField(blank=True, max_length=64, null=True, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_admin', models.BooleanField(default=False)),
            ],
            options={
                'db_table': 'customuser',
            },
        ),
        migrations.CreateModel(
            name='Day',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(blank=True, null=True)),
                ('good_day', models.BooleanField(default=False)),
                ('neutral_day', models.BooleanField(default=False)),
                ('nauseous', models.BooleanField(default=False)),
                ('fainting', models.BooleanField(default=False)),
                ('bed_bound', models.BooleanField(default=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='days', to='pots_pal.customuser')),
            ],
            options={
                'db_table': 'days',
            },
        ),
        migrations.CreateModel(
            name='Data',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('meal_item', django.contrib.postgres.fields.ArrayField(base_field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=100), size=10), size=None)),
                ('favorite_meal', models.BooleanField(default=False)),
                ('favorite_meal_item', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=100), blank=True, null=True, size=None)),
                ('water_intake', models.IntegerField(default=0)),
                ('salt_intake', models.IntegerField(default=0)),
                ('weather', models.IntegerField(default=0)),
                ('low_heart_rate', models.IntegerField(default=0)),
                ('high_heart_rate', models.IntegerField(default=0)),
                ('activity', models.BooleanField(default=False)),
                ('day', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='data', to='pots_pal.day')),
            ],
            options={
                'db_table': 'data',
            },
        ),
    ]
