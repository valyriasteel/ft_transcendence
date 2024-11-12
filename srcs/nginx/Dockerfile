FROM nginx:latest

# Nginx konfigürasyon dosyasını kopyalayın
COPY conf/nginx.conf /etc/nginx/nginx.conf

# Tüm html klasörünü kopyalayarak içinde bulunan index.html, style.css, script.js gibi dosyaları Nginx kök dizinine yerleştirin
COPY html /usr/share/nginx/html

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]
