from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .views import LoginIntra42View, CallbackIntra42View, Verify2FAView, LogoutAPIView, getProfileView

urlpatterns = [
    path('loginintra42/', LoginIntra42View.as_view(), name='login_intra'),  # Social Login
    path('callback/', CallbackIntra42View.as_view(), name='callback'),     # Social Login Callback
    path('verify-2fa/', Verify2FAView.as_view(), name='verify_2fa'),       # 2FA Verification
    path('logout/', LogoutAPIView.as_view(), name='logout'),                  # Logout Endpoint
    path('logout/', getProfileView.as_view(), name='get_profil'),
    path('check_index/', getProfileView.as_view(), name='check'),  
]
