from rest_framework import viewsets
from rest_framework.pagination import CursorPagination

from message.models import Message
from message.serializers import MessageSerializer


class MessagePagination(CursorPagination):
    page_size = 3    
    ordering = "id"

class MessageAPI(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    queryset = Message.objects.all()
    pagination_class = MessagePagination
