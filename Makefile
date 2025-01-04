COMPOSE_FILE=./srcs/docker-compose.yml

.PHONY: all down re clean stop_containers rm_containers rm_images rm_networks logs rm_volumes rm_all

all:
	docker-compose -f $(COMPOSE_FILE) up

down:
	@docker-compose -f $(COMPOSE_FILE) down

re:
	docker-compose -f $(COMPOSE_FILE) up --build

clean: stop_containers rm_containers rm_images rm_networks rm_volumes rm_all rm_files

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

rm_volumes:
	@if [ -n "$$(docker volume ls -q)" ]; then \
		docker volume rm $$(docker volume ls -q); \
	fi

rm_all:
	@docker system prune -af

rm_files:
	@rm -rf ./srcs/backend/static/
	@rm -rf ./srcs/backend/pong_game/__pycache__/
	@rm -rf ./srcs/backend/accounts/migrations/__pycache__/
	@rm -rf ./srcs/backend/accounts/migrations/0001_initial.py
	@rm -rf ./srcs/backend/accounts/__pycache__/

logs:
	@docker-compose -f $(COMPOSE_FILE) logs