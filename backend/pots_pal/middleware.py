import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class JWTAuthMiddleware(MiddlewareMixin):
    def process_request(self, request):
        auth = request.headers.get('Authorization', None)
        if auth is not None and auth.startswith('Bearer '):
            token = auth.split(' ')[1]
            try:
                payload = UntypedToken(token)
                user = get_user_model().objects.get(email=payload['email'])
                request.user = user
            except jwt.ExpiredSignatureError:
                pass
            except (jwt.DecodeError, TokenError, InvalidToken):
                pass
            except get_user_model().DoesNotExist:
                pass