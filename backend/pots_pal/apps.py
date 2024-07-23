from django.apps import AppConfig

class PotsPalConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'pots_pal'

    def ready(self):
        import pots_pal.signals
