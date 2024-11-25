FROM nginx:latest

# Sertifikalar için OpenSSL yükleniyor
RUN apt-get update && apt-get install -y openssl && apt-get clean

# HTTPS Sertifikası oluşturuluyor
RUN mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx-selfsigned.key \
    -out /etc/nginx/ssl/nginx-selfsigned.crt \
    -subj "/C=TR/ST=Kocaeli/L=Gebze/O=42Kocaeli/OU=DelikanlilikveMertlikDepartment/CN=localhost"

# Nginx yapılandırması ekleniyor
COPY nginx.conf /etc/nginx/nginx.conf

# SPA dosyaları kopyalanıyor
COPY public /usr/share/nginx/html
