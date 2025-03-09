from django.urls import path
from .views import LoginIntra42View, CallbackIntra42View, Verify2FAView, LogoutAPIView, TestApiView, GetProfileView

urlpatterns = [
    path('loginintra42/', LoginIntra42View.as_view(), name='login_intra'),  # Social Login
    path('callback/', CallbackIntra42View.as_view(), name='callback'),     # Social Login Callback
    path('verify-2fa/', Verify2FAView.as_view(), name='verify_2fa'),       # 2FA Verification
    path('logout/', LogoutAPIView.as_view(), name='logout'),                  # Logout Endpoint
    path('get_profile/', GetProfileView.as_view(), name='check'),
    path('test/', TestApiView.as_view(), name='test'),
]
