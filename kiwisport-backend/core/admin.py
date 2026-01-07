from django.contrib import admin
from .models import Member, Attendance, Payment

admin.site.register(Member)
admin.site.register(Attendance)
admin.site.register(Payment)
