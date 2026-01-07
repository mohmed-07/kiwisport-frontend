from rest_framework import viewsets
from .models import Member, Attendance, Payment
from .serializers import MemberSerializer, AttendanceSerializer, PaymentSerializer
from rest_framework.response import Response
from rest_framework import status

class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        date = self.request.query_params.get("date")
        sport = self.request.query_params.get("sport")

        if date:
            queryset = queryset.filter(date=date)
        if sport:
            queryset = queryset.filter(member__sport_type=sport)

        return queryset

    def create(self, request, *args, **kwargs):
        member = request.data.get("member")
        date = request.data.get("date")

        attendance, created = Attendance.objects.update_or_create(
            member_id=member,
            date=date,
            defaults={"status": request.data.get("status")}
        )

        serializer = self.get_serializer(attendance)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        month = self.request.query_params.get("month")
        sport = self.request.query_params.get("sport")

        if month:
            queryset = queryset.filter(month=month)
        if sport:
            queryset = queryset.filter(member__sport_type=sport)

        return queryset
