from rest_framework import serializers
from .models import Member, Attendance, Payment

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = [
            "id",
            "name",
            "phone_number",
            "date_of_birth",
            "registration_date",
            "passport_number",
            "sport_type",
            "subscription_status",
            "image",
        ]
class AttendanceSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source="member.name", read_only=True)
    sport_type = serializers.CharField(source="member.sport_type", read_only=True)

    class Meta:
        model = Attendance
        fields = ["id", "member", "member_name", "sport_type", "date", "status"]

class PaymentSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source="member.name", read_only=True)
    sport_type = serializers.CharField(source="member.sport_type", read_only=True)

    class Meta:
        model = Payment
        # ✅ Added 'amount', 'assurance', and 'passport' below:
        fields = [
            "id", 
            "member", 
            "member_name", 
            "sport_type", 
            "month", 
            "status", 
            "amount", 
            "assurance", 
            "passport"
        ]
