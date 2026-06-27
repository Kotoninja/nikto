import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from message.models import Message


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = "chat"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            text_data_json: dict = json.loads(text_data)
            message: str | None = text_data_json.get("message")
            username: str | None = text_data_json.get("username")

            if not username or not username.strip():
                await self.send(
                    text_data=json.dumps(
                        {
                            "status": "error",
                            "error": "Please provide a username to send messages",
                        }
                    )
                )
                return

            if not message or not message.strip():
                await self.send(
                    text_data=json.dumps(
                        {"status": "error", "error": "Please provide a message to send"}
                    )
                )
                return

            new_message: Message = await self.save_message(
                username=username, text=message
            )

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat.message",
                    "id": new_message.pk,
                    "username": new_message.username,
                    "message": new_message.text,
                    "timestamp": json.dumps(new_message.timestamp, default=str),
                },
            )

        except json.JSONDecodeError:
            await self.send(
                text_data=json.dumps(
                    {"type": "error", "error": "Invalid JSON format received"}
                )
            )

    async def chat_message(self, event: dict):
        await self.send(
            text_data=json.dumps(
                {
                    "id": event["id"],
                    "username": event["username"],
                    "message": event["message"],
                    "timestamp": event["timestamp"],
                }
            )
        )

    @database_sync_to_async
    def save_message(self, username: str, text: str) -> Message:
        return Message.objects.create(username=username, text=text)
