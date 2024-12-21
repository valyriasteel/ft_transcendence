from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .views import LoginIntra42View, CallbackIntra42View, Verify2FAView, LogoutView

urlpatterns = [
    path('loginintra42/', LoginIntra42View.as_view(), name='login_intra'),  # Social Login
    path('callback/', CallbackIntra42View.as_view(), name='callback'),     # Social Login Callback
    path('verify-2fa/', Verify2FAView.as_view(), name='verify_2fa'),       # 2FA Verification
    path('logout/', LogoutView.as_view(), name='logout'),                  # Logout Endpoint

    # JWT Authentication Endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),    # JWT Token Obtain
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh Token
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),     # Verify Token
]
