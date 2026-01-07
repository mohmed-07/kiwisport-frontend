from django.core.management.base import BaseCommand
from core.models import Member, Attendance, Payment
from random import choice, randint

class Command(BaseCommand):
    help = 'Add test attendance and payments for all members'

    def handle(self, *args, **kwargs):
        members = Member.objects.all()

        for member in members:
            # Attendance
            if not Attendance.objects.filter(member=member).exists():
                present = choice([True, False])
                Attendance.objects.create(member=member, present=present)
                self.stdout.write(self.style.SUCCESS(f'Attendance added for {member.name}'))

            # Payment
            if not Payment.objects.filter(member=member).exists():
                amount = randint(50, 200)  # random amount
                paid = choice([True, False])
                Payment.objects.create(member=member, amount=amount, paid=paid)
                self.stdout.write(self.style.SUCCESS(f'Payment added for {member.name}'))
