# from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from message.models import Message
from message.serializers import MessageSerializer
from rest_framework import status


class MessageAPI(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    queryset = Message.objects.all()

    def preform_create(self, serializer: MessageSerializer):
        serializer.save()

    def list(self, request):
        messages = self.get_queryset()
        serializer = self.get_serializer(messages, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            self.preform_create(serializer)
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
