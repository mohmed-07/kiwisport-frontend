from django.core.management.base import BaseCommand
from core.models import Member

class Command(BaseCommand):
    help = 'Add test members to the database'

    def handle(self, *args, **kwargs):
        names = ["Mohamed Ait Si Ahmed", "Youssef Ait Dada", "Badr Dîneê"]
        for name in names:
            if not Member.objects.filter(name=name).exists():
                Member.objects.create(name=name, subscription_status="Active")
                self.stdout.write(self.style.SUCCESS(f'Added member: {name}'))
            else:
                self.stdout.write(f'Member already exists: {name}')
        self.stdout.write(self.style.SUCCESS('Test members added successfully.'))