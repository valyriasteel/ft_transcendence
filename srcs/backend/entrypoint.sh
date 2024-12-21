#!/bin/bash

echo "Waiting for PostgreSQL to be ready..."
until python -c "
import socket
import time
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
while True:
    try:
        s.connect(('db', 5432))
        s.close()
        break
    except socket.error:
        time.sleep(1)
"; do
  echo "Waiting for database connection at db:5432..."
done
echo "PostgreSQL is ready!"

echo "Applying migrations..."
python manage.py makemigrations
python manage.py migrate

if [ "$DJANGO_SUPERUSER_USERNAME" ] && [ "$DJANGO_SUPERUSER_PASSWORD" ]; then
  echo "Checking if superuser exists..."
  python manage.py shell <<EOF
from django.contrib.auth.models import User
if not User.objects.filter(username="$DJANGO_SUPERUSER_USERNAME").exists():
    User.objects.create_superuser("$DJANGO_SUPERUSER_USERNAME", "$DJANGO_SUPERUSER_EMAIL", "$DJANGO_SUPERUSER_PASSWORD")
EOF
fi

python manage.py collectstatic --noinput

echo "Starting Django server..."
exec python manage.py runserver 0.0.0.0:8000