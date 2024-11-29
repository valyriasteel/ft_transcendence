#!/bin/sh

if [ ! -f /etc/nginx/ssl/nginx.crt ]; then
	echo "Nginx: setting up ssl ...";
	mkdir -p /etc/nginx/ssl;
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt -subj "/C=$COUNTRY/ST=$STATE/L=$LOCALITY/O=$ORGANIZATION/OU=$ORGANIZATIONAL_UNIT/CN=$COMMON_NAME";
	echo "Nginx: ssl is set up!";
fi

exec "$@"