FROM nginx:alpine

RUN apk update && apk upgrade && \
    apk add openssl && rm -rf /var/cache/apk/*

COPY nginx_certs.sh /tmp
COPY html /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

RUN chmod +x /tmp/nginx_certs.sh

ENTRYPOINT ["/tmp/nginx_certs.sh"]

CMD ["nginx", "-g", "daemon off;"]