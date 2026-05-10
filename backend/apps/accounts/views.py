from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer
from .password_serializers import ChangePasswordSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user, context={'request': request}).data,
            "token": token.key
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username') # User might send email as username?
        password = request.data.get('password')
        # Allow login with email
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        user = authenticate(username=username, password=password)
        
        # Try email if username fails
        if not user:
             try:
                 user_obj = User.objects.get(email=username)
                 user = authenticate(username=user_obj.username, password=password)
             except User.DoesNotExist:
                 pass

        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "user": UserSerializer(user, context={'request': request}).data,
                "token": token.key
            })
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'success': 'Logged out'})

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response({"success": "Password updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
