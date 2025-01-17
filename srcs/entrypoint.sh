#!/bin/bash

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h db -p 5432 -U $POSTGRES_USER; do
  echo "PostgreSQL is not ready yet. Retrying in 5 seconds..."
  sleep 5
done
echo "PostgreSQL is ready!"

echo "Applying migrations..."
python manage.py makemigrations
python manage.py migrate --noinput

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