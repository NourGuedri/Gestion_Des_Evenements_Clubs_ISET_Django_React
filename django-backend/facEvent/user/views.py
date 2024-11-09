from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer, ProfileSerializer
from .models import VerificationCode, Profile
from club.models import Club
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from . import utils
from django.db.models import Count, Q
from event.models import Event




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def home(request):
    user = request.user
    try:
        profile = Profile.objects.get(user=user)
        if not profile.verified:
            return Response({'message': 'Not verified'}, status=400)
    except Profile.DoesNotExist:
        return Response({'message': 'No profile'}, status=404)
    # check if the clubs in which the manager is the authenticated user
    clubs = Club.objects.filter(manager=user)
    # check if the user is an admin
    is_admin = user.profile.is_admin
    return Response({'message': 'Welcome home', 'is_admin': is_admin, 'managed_clubs': clubs.values()}, status=200)

@api_view(['POST'])
@permission_classes([AllowAny])
def finish_profile(request):
    # Add the authenticated user to the data
    data = request.data.copy()
    data['phone_number'] = '+216' + request.data['phone_number'].replace(' ', '')
    
    data['user'] = request.user.id
    # Use serializer to create the new profile
    serializer = ProfileSerializer(data=data, context={'request': request})
    if serializer.is_valid():
        profile = serializer.save()
        if profile:
            return Response(status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    print(request.data)
    
    # check password and confirm_password
    if request.data.get('password') != request.data.get('confirm_password'):
        return Response({
            'password': 'Passwords do not match',
            'confirm_password': 'Passwords do not match'                     
             }, status=status.HTTP_400_BAD_REQUEST)
    
    
    serializer = UserSerializer(data=request.data,context={'request': request})
    if serializer.is_valid():
        user = User.objects.create_user(password=request.data.get('password'),username=request.data.get('username'),first_name=request.data.get('first_name'),last_name=request.data.get('last_name'))
        if user:
            return Response(
                {
                    'message': 'Successfully registered user',
                }
                ,status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_code(request):
    user = request.user
    # Delete the old verification code if it was created more than 1 minute ago or if it doesn't exist
    try:
        old_verification_code = VerificationCode.objects.get(user=user)
        time_since_code_sent = timezone.now() - old_verification_code.created_at
        if time_since_code_sent > timedelta(minutes=0):
            old_verification_code.delete()
        else:
            time_left = timedelta(minutes=1) - time_since_code_sent
            return Response({'message': f'Verification code already sent, please wait for {time_left.seconds} seconds.'}, status=400)
    except VerificationCode.DoesNotExist:
        pass

    # Generate and send the new verification code
    verification_code = VerificationCode.objects.create(user=user)
    print(verification_code)
    verification_code.generate_code()
    utils.send_verification_code(user.profile.phone_number, verification_code.code)
    masked_username = '*****' + user.profile.phone_number[9:]
    return Response({'message': 'Verification code sent to'+masked_username+' successfully'})



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify(request):
    user = request.user
    code = request.data.get('code')

    # Check if the code is valid
    if not code or code == '':
        print('Verification code not provided')
        return Response({'message': 'Verification code not provided'}, status=400)
    
    try:
        verification_code = VerificationCode.objects.get(user=user)
    except VerificationCode.DoesNotExist:
        print('Verification code not sent')
        return Response({'message': 'Verification code not sent'}, status=400)

    if not verification_code.is_valid(user) or verification_code.code != code:
        print('Invalid verification code or expired')
        return Response({'message': 'Invalid verification code or expired'}, status=400)

    # Verify the user
    user.profile.verified = True
    user.profile.save()
    #delete the code
    verification_code.delete()

    
    return Response({'message': 'User verified successfully'})




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    if request.user.profile.is_admin == False:
        return Response({'error': 'You are not authorized to get all users'}, status=status.HTTP_403_FORBIDDEN)
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_managers(request):
    if request.user.profile.is_admin == False:
        return Response({'error': 'You are not authorized to get all managers'}, status=status.HTTP_403_FORBIDDEN)
    # each club has manager field that contains a user 
    managers = User.objects.filter(club__manager=request.user)
    serializer = UserSerializer(managers, many=True)
    return Response(serializer.data)





@api_view(['GET'])
@permission_classes([IsAuthenticated])
def general_stats(request):
    if request.user.profile.is_admin == False:
        return Response({'error': 'You are not authorized to get general stats'}, status=status.HTTP_403_FORBIDDEN)
    users = User.objects.all()
    clubs = Club.objects.all()
    managers = User.objects.filter(club__manager=request.user)
    
    num_of_ended_events = Event.objects.filter(status='ended').count()
    # club_with_most_ended_events is a variable containing the club with the most ended events(status=ended), first we get All events that have ended rank them by club and count them then get the club with the most events
    club_with_most_ended_events = Club.objects.annotate(num_ended_events=Count('event', filter=Q(event__status='ended'))).order_by('-num_ended_events').first()
    num_of_pending_events = Event.objects.filter(status='pending').count()

    return Response({
        'users_count': users.count(),
        'clubs_count': clubs.count(),
        'club_with_most_ended_events': club_with_most_ended_events.name,
        'number_of_pending_events': num_of_pending_events,
        'number_of_ended_events': num_of_ended_events,
    })