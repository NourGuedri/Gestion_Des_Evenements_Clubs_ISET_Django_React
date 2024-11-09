from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.shortcuts import render
from .serializers import ClubSerializer,MembershipSerializer
from .models import Club,Membership
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User


# Create your views here.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_club(request):

    
    # check if any field is not present
    if not request.data.get('name') or not request.data.get('department') or not request.data.get('field') or not request.data.get('description') or not request.data.get('manager') or not request.data.get('logo'):
        return Response({'error': 'Please provide all the required fields'}, status=status.HTTP_400_BAD_REQUEST)

    if request.user.profile.is_admin == False:
        return Response({'error': 'You are not authorized to add a club'}, status=status.HTTP_403_FORBIDDEN)
    else:    
        serializer = ClubSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            club = serializer.save()
            # get the manager of the club by the id
            user = User.objects.get(id=request.data['manager'])
            club.manager = user
            club.save()
            if club:
                return Response({
                    'message': 'Club added successfully'    
                }
                    ,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_club(request):
    if request.user.profile.is_admin == False:
        return Response({'error': 'You are not authorized to delete a club'}, status=status.HTTP_403_FORBIDDEN)
    else:    
        club = Club.objects.get(id=request.data['id'])
        club.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_club(request):
    print(request.data)
    if request.user.profile.is_admin == False:
        return Response({'error': 'You are not authorized to update a club'}, status=status.HTTP_403_FORBIDDEN)
    else:
        club = Club.objects.get(id=request.data['id'])
        
        # Update only the provided fields in the request
        serializer = ClubSerializer(instance=club, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # get the updated club
            club = Club.objects.get(id=request.data['id'])
            try:
                # get the manager of the club by the id
                manager = request.data['manager']
                # update the manager of the club
                user = User.objects.get(id=manager)
                club.manager = user
                club.save()
            except:
                pass
            
            return Response(
                {
                    'message': 'Club updated successfully'
                }
                ,status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_clubs(request):
    clubs = Club.objects.all()
    if request.user.is_authenticated:
        if request.user.profile.is_admin:
            print('admin---------------------------')
            serializer = ClubSerializer(clubs, many=True, context={'full': True})
            return Response(serializer.data)
    serializer = ClubSerializer(clubs, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_membership(request):
    print(request.user)
    

    
    club = Club.objects.get(id=request.data['id'])
    # check if the manager is the same as the user
    if club.manager == request.user:
        return Response({'error': 'You are the manager of the club'}, status=status.HTTP_403_FORBIDDEN)
    
    # check if the user has no previous pending or active requests
    existing_membership = Membership.objects.filter(user=request.user, club=club, state__in=['PENDING', 'ACTIVE'])
    if existing_membership.exists():
        return Response({'error': 'You already have a pending or active membership request'}, status=status.HTTP_400_BAD_REQUEST)

    serializer_input = {'club': club.id, 'user': request.user.id,'note': request.data['note']}
    serializer = MembershipSerializer(data=serializer_input, context={'request': request})
    if serializer.is_valid():
        membership = serializer.save()
        if membership:
            return Response({"message": "Membership request sent successfully, waiting for approval from the club manager"},status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_club_membership_state(request):
    # get the club from the providid membership id
    membership = Membership.objects.get(id=request.data['membership_id'])
    club = membership.club
    
    # check if user is the same as the club manager
    if club.manager != request.user:
        return Response({'error': 'You are not authorized to change the membership state'}, status=status.HTTP_403_FORBIDDEN)
    
    membership_state=membership.toggle_club_membership_state()


    return Response({"state":membership_state}, status=status.HTTP_200_OK)
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_club_memberships(request):

    # get the club of which the id is passed in the request params
    club = Club.objects.get(id=request.query_params['club_id'])

    # check if the user is the manager of the club
    # if club.manager != request.user:
    #     return Response({'error': 'You are not authorized to view the memberships'}, status=status.HTTP_403_FORBIDDEN)
    
    memberships = Membership.objects.filter(club=club)
    serializer = MembershipSerializer(memberships, many=True)
    
    return Response(
        {
            'memberships': serializer.data
        }
    )



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_clubs(request):
    if request.user.profile.is_admin == False:
        return Response({'error': 'You are not authorized to get all clubs'}, status=status.HTTP_403_FORBIDDEN)

    clubs = Club.objects.all()
    serializer = ClubSerializer(clubs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_club_stats(request):
    if request.user.profile.is_admin == False:
        return Response({'error': 'You are not authorized to get club stats'}, status=status.HTTP_403_FORBIDDEN)
    
    # get the club of which the id is passed in the request params
    club = Club.objects.get(id=request.query_params['club_id'])
    memberships = Membership.objects.filter(club=club)
    active_members = memberships.filter(state='ACTIVE').count()
    pending_members = memberships.filter(state='PENDING').count()
    removed_members = memberships.filter(state='REMOVED').count()
    stats = {
        'active_members': active_members,
        'pending_members': pending_members,
        'removed_members': removed_members,
    }
    return Response(stats)