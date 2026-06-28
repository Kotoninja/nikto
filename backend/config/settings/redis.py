from config.env import env

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": f"redis://redis:{env("REDIS_PORT",default=6379)}",
    }
}
