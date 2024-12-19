FROM python:3.10-slim

# Çalışma dizinini oluştur
WORKDIR /usr/src/app

# Gereksinimleri yükle
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Projeyi kopyala
COPY . .

# Entrypoint script'ini kopyala
COPY entrypoint.sh /usr/src/app/

# Script'in çalıştırılabilir olmasını sağla
RUN chmod +x /usr/src/app/entrypoint.sh

# Default command olarak entrypoint script'i ayarla
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]