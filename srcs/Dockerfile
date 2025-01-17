FROM python:3.13-slim

WORKDIR /app

RUN apt-get update && apt-get upgrade -y && \
	apt-get install -y postgresql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . ./app/

COPY entrypoint.sh /app

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]