from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from .views import LoginIntra42View, CallbackIntra42View, Verify2FAView, LogoutAPIView, getProfileView, TestApiView, IndexRender

urlpatterns = [
    path('loginintra42/', LoginIntra42View.as_view(), name='login_intra'),  # Social Login
    path('callback/', CallbackIntra42View.as_view(), name='callback'),     # Social Login Callback
    path('verify-2fa/', Verify2FAView.as_view(), name='verify_2fa'),       # 2FA Verification
    path('logout/', LogoutAPIView.as_view(), name='logout'),                  # Logout Endpoint
    path('get_profil/', getProfileView.as_view(), name='get_profil'),
    path('check_index/', getProfileView.as_view(), name='check'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('test/', TestApiView.as_view(), name='test'),
    path('indexRender/', IndexRender.as_view(), name='indexRender')
]
