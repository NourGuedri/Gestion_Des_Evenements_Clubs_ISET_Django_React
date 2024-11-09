from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.shortcuts import render
from .serializers import EventSerializer, QuestionSerializer, AnswerSerializer
from .models import Event,Question,Answer
from club.models import Club
from rest_framework.response import Response
from rest_framework import status
from . import utils




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_event(request):
    print(request.data)
    # check if user.profile is manager of data['organizing_club']
    organizing_club = Club.objects.get(id=int(request.data['organizing_club'][0]))
    if organizing_club.manager != request.user:
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    data = request.data
    serializer = EventSerializer(data=data)
    print(data)
    if serializer.is_valid():
        # adding the organizing club to the event
        serializer.validated_data['organizing_club'] = organizing_club
        
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel_event(request):
    event = Event.objects.get(id=request.data['event_id'])
    organizing_club = event.organizing_club
    if organizing_club.manager != request.user:
        return Response({'message':'You are not a manager of the organizing club.'},status=status.HTTP_403_FORBIDDEN)
    data = request.data
    event = Event.objects.get(id=data['event_id'])
    event.status = 'canceled'
    event.save()
    return Response({'message':'Event canceled successfully.'},status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_events(request):
    print(request.user)
    print("----------------------------------")
    events = Event.objects.exclude(status='pending').exclude(status='rejected')
    serializer = EventSerializer(events, many=True, context={'user': request.user})
    # sort with popular and upcoming events each in it own list
    popular_events = sorted(serializer.data, key=lambda x: x['attendees'], reverse=True)
    upcoming_events = sorted(serializer.data, key=lambda x: x['starting_date_time'])
    print(popular_events)
    
    return Response(
        {
            'popular_events': popular_events,
            'upcoming_events': upcoming_events
        }
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_event_status(request):
    # check if user.profile is admin
    if not request.user.profile.is_admin:
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    data = request.data
    event = Event.objects.get(id=data['event_id'])
    event_status = event.toggle_approval()
    event.save()
    return Response({'status': event_status},status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_get_all_events(request):
    # check if user.profile is admin
    if not request.user.profile.is_admin:
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    events = Event.objects.all()
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_club_events(request):
    # get the club id from the request params
    club_id = request.GET['club_id']
    club = Club.objects.get(id=club_id)
    # check if user.profile is manager of the club
    if club.manager != request.user:
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    events = Event.objects.filter(organizing_club=club)
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def attend_event(request):
    data = request.data
    event = Event.objects.get(id=data['event_id'])
    message, success = event.toggle_attend(request.user)
    if success:
        return Response({'message': message},status=status.HTTP_200_OK)
    else:
        return Response({'message': message},status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ask_question(request):
    data = request.data
    print(data)
    
    event = Event.objects.get(id=data['event_id'])
    
    # check if user is an attendee of the event
    if request.user not in event.attendees.all():
        return Response({'message': 'You are not an attendee of the event.'},status=status.HTTP_403_FORBIDDEN)

    question = Question(author=request.user,event=event, question=data['question'])
    question.save()
    return Response({'message':'Question submitted successfully, You`ll receive an answer On your phone number.'},status=status.HTTP_200_OK)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def answer_question(request):
    data = request.data
    question = Question.objects.get(id=data['question_id'])
    
    # check if user is a manager of the organizing club
    if question.event.organizing_club.manager != request.user:
        return Response({"message":"You are not a manager of the organizing club."},status=status.HTTP_403_FORBIDDEN)
    answer = Answer(question=question, text=data['answer'])
    answer.save()
    utils.send_answer(question.author.profile.phone_number, question.question, answer.text)
    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def event_qa_page(request):
    print(request.user)
    print("---------------asjdhas-------")
    # get all questions and answers of the event
    event = Event.objects.get(id=request.GET['event_id'])

    questions = Question.objects.filter(event=event).filter(answer__isnull=False)
     
    event_details = EventSerializer(event, context={'full': True, 'user': request.user})
    
    # check if user is authed
    if request.user.is_authenticated and request.user in event.attendees.all():
        question_serializer = QuestionSerializer(questions, many=True, context={'full': False}).data
    else:
        question_serializer = ['unauthorized']
    return Response({
        'event': event_details.data,
        'questions': question_serializer
                
        }, status=status.HTTP_200_OK)
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unanswerd_questions(request):
    # get all unanswerd questions of the events of the clubs managed by manager user
    clubs = Club.objects.filter(manager=request.user)
    if not clubs or len(clubs) == 0:
        return Response({'message':'You are not a manager of any club.'},status=status.HTTP_403_FORBIDDEN)
    events = Event.objects.filter(organizing_club__in=clubs)
    if not events or len(events) == 0:
        return Response({'message':'You are not a manager of any club that has events.'},status=status.HTTP_403_FORBIDDEN)
    print(clubs)
    questions = Question.objects.filter(event__in=events).filter(answer__isnull=True)
    question_serializer = QuestionSerializer(questions, many=True, context={'full': True})
    print(question_serializer.data)
    return Response(question_serializer.data, status=status.HTTP_200_OK)