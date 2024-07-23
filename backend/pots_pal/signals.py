from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser, Favorite

@receiver(post_save, sender=CustomUser)
def create_user_favorite(sender, instance, created, **kwargs):
    if created:
        Favorite.objects.create(user=instance)