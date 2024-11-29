FROM nginx:alpine
# Resmi Nginx Alpine Linux tabanlı image'i kullanılarak başlangıç image'i olarak tanımlanır.

RUN apk update && apk upgrade && \
    # Alpine paket yöneticisini günceller ve sistemdeki mevcut paketleri yükseltir.
    apk add openssl && rm -rf /var/cache/apk/*
    # OpenSSL paketini kurar ve geçici dosya önbelleğini temizler.

COPY nginx_certs.sh /tmp
# 'nginx_certs.sh' betiğini konteynerin '/tmp' dizinine kopyalar.
COPY html /usr/share/nginx/html
# 'html' dizinindeki dosyaları Nginx'in varsayılan HTML dizinine kopyalar.
COPY nginx.conf /etc/nginx/nginx.conf
# Özel 'nginx.conf' yapılandırma dosyasını Nginx yapılandırma dizinine kopyalar.

RUN chmod +x /tmp/nginx_certs.sh
# '/tmp/nginx_certs.sh' betiğine çalıştırma izni verir.

ENTRYPOINT ["/tmp/nginx_certs.sh"]
# Konteyner başlatıldığında önce '/tmp/nginx_certs.sh' betiğini çalıştırır.

CMD ["nginx", "-g", "daemon off;"]
# Nginx'i 'daemon off' modunda (arka planda çalıştırılmadan) başlatır.