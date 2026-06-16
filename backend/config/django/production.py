from .base import *

DEBUG = False

ALLOWED_HOSTS = env("DJANGO_ALLOWED_HOSTS", default=[])
