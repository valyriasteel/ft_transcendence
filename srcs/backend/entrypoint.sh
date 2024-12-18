#!/bin/bash

# Veritabanı bağlantısının hazır olmasını bekle
echo "Waiting for database..."
until python -c "import socket; socket.create_connection(('$POSTGRES_HOST', $POSTGRES_PORT))"; do
  sleep 0.1
done
echo "Database is ready!"

# Django migrasyon işlemleri
echo "Applying migrations..."
python manage.py makemigrations
python manage.py migrate

# Eğer süper kullanıcı oluşturulmamışsa oluştur
if [ "$DJANGO_SUPERUSER_USERNAME" ] && [ "$DJANGO_SUPERUSER_PASSWORD" ]; then
  echo "Checking if superuser exists..."
  python manage.py shell <<EOF
from django.contrib.auth.models import User
if not User.objects.filter(username="$DJANGO_SUPERUSER_USERNAME").exists():
    User.objects.create_superuser("$DJANGO_SUPERUSER_USERNAME", "$DJANGO_SUPERUSER_EMAIL", "$DJANGO_SUPERUSER_PASSWORD")
EOF
fi

# Django geliştirme sunucusunu başlat
echo "Starting Django server..."
exec python manage.py runserver 0.0.0.0:8000
