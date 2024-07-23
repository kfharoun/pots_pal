from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Loads the seed data into the database'

    def handle(self, *args, **options):
        with open('seed.sql', 'r') as file:
            with connection.cursor() as cursor:
                cursor.execute(file.read())
                self.stdout.write(self.style.SUCCESS('Successfully seeded the database.'))