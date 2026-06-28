from rest_framework import viewsets
from rest_framework.pagination import CursorPagination

from message.models import Message
from message.serializers import MessageSerializer


class MessagePagination(CursorPagination):
    page_size = 10
    ordering = "-id"


class MessageAPI(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    queryset = Message.objects.all()
    pagination_class = MessagePagination

    def list(self, request):
        page = self.paginate_queryset(self.get_queryset())
        serializer = self.get_serializer(reversed(page), many=True)
        return self.get_paginated_response(data=serializer.data)
