from django.db import models

class Member(models.Model):
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    registration_date = models.DateField(auto_now_add=False, blank=True, null=True)
    passport_number = models.CharField(max_length=50, blank=True, null=True)
    sport_type = models.CharField(max_length=50, blank=True, null=True)
    subscription_status = models.CharField(max_length=20, default="Active")
    image = models.ImageField(upload_to="members/", blank=True, null=True)

    def __str__(self):
        return self.name
class Attendance(models.Model):
    STATUS_CHOICES = [
        ("Present", "Present"),
        ("Absent", "Absent"),
    ]

    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    class Meta:
        unique_together = ("member", "date")

    def __str__(self):
        return f"{self.member.name} - {self.date} - {self.status}"

class Payment(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    month = models.DateField()
    status = models.CharField(max_length=20, default='Unpaid')
    
    # These fields must exist for your React code to work:
    amount = models.DecimalField(max_digits=10, decimal_places=2) # or IntegerField
    assurance = models.BooleanField(default=False)
    passport = models.BooleanField(default=False)
