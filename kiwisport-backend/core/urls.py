from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MemberViewSet, AttendanceViewSet, PaymentViewSet


router = DefaultRouter()
router.register(r'members', MemberViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
