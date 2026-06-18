from rest_framework import viewsets

from message.models import Message
from message.serializers import MessageSerializer


class MessageAPI(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    queryset = Message.objects.all()
