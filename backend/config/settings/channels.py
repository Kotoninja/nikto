from config.env import env

# Daphne
ASGI_APPLICATION = "config.asgi.application"

# Channels_redis
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [
                {
                    "address": f"redis://redis:{env("REDIS_PORT",default=6379)}",
                    "socket_timeout": 10,
                }
            ],
        },
    },
}
