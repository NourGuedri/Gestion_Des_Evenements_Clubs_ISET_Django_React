from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event,Question,Answer
from club.serializers import ClubSerializer
from user.serializers import UserSerializer


class EventSerializer(serializers.ModelSerializer):
    attendees = serializers.SerializerMethodField()
    organizing_club = serializers.SerializerMethodField()
    starting_date_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    ending_date_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    attending = serializers.SerializerMethodField()
    class Meta:
        model = Event
        fields = '__all__'
        
    def get_attendees(self, obj):
        # check if conxte is full
        full = self.context.get('full', False)
        if full:
            # get all attendees first and last named
            attendees = obj.attendees.all()
            serializer = UserSerializer(attendees, many=True, context={'only_names':True})
            return serializer.data
        else:
            return obj.attendees.count()
    def get_organizing_club(self, obj):
        full = self.context.get('full', False)
        if full:
            return obj.organizing_club.name
        else:
            serializer = ClubSerializer(obj.organizing_club)
        return serializer.data
    def get_attending(self, obj):
        user = self.context.get('user', None)
        print(user)
        if user:
            return obj.attendees.filter(id=user.id).exists()
        return False
    

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'
        
        
class QuestionSerializer(serializers.ModelSerializer):
    Answer = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()
    event = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = '__all__'
        
    def get_Answer(self, obj):
        answers = Answer.objects.filter(question=obj)
        serializer = AnswerSerializer(answers, many=True)
        return serializer.data

    def get_author(self, obj):
        user = User.objects.get(id=obj.author.id)
        full = self.context.get('full', False)
        if full:
            serializer = UserSerializer(user)
        else:
            return user.first_name + ' ' + user.last_name
        return serializer.data

    def get_event(self, obj):
        full = self.context.get('full', False)
        if full:
            serializer = EventSerializer(obj.event)
        else:
            return obj.event.name
        return serializer.data