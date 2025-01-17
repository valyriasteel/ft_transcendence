FROM nginx:1.27.3-alpine

RUN apk update && apk upgrade && \
    apk add openssl && \
    rm -rf /var/cache/apk/* && \
    apk cache clean

COPY nginx_certs.sh /tmp
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

RUN chmod +x /tmp/nginx_certs.sh

ENTRYPOINT ["/tmp/nginx_certs.sh"]

CMD ["nginx", "-g", "daemon off;"]