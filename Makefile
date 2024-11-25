COMPOSE_FILE=./srcs/docker-compose.yml

.PHONY: all down re clean stop_containers rm_containers rm_images rm_networks logs

all:
	@trap "docker-compose -f $(COMPOSE_FILE) down; exit 0" INT; \
	docker-compose -f $(COMPOSE_FILE) up --abort-on-container-exit

down:
	@docker-compose -f $(COMPOSE_FILE) down

re:
	@trap "docker-compose -f $(COMPOSE_FILE) down; exit 0" INT; \
	docker-compose -f $(COMPOSE_FILE) up --build || true

clean: stop_containers rm_containers rm_images rm_networks rm_all

stop_containers:
	@if [ -n "$$(docker ps -q)" ]; then \
		docker stop $$(docker ps -q); \
	fi

rm_containers:
	@if [ -n "$$(docker ps -qa)" ]; then \
		docker rm $$(docker ps -qa); \
	fi

rm_images:
	@if [ -n "$$(docker images -q)" ]; then \
		docker rmi -f $$(docker images -q); \
	fi

rm_networks:
	@if [ -n "$$(docker network ls --filter type=custom -q)" ]; then \
		docker network rm $$(docker network ls --filter type=custom -q); \
	fi

rm_all:
	@docker system prune -af

logs:
	@docker-compose -f $(COMPOSE_FILE) logs -f