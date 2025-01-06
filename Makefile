COMPOSE_FILE=./docker-compose.yml

.PHONY: all down re clean logs

all:
	@docker-compose -f $(COMPOSE_FILE) up

down:
	@docker-compose -f $(COMPOSE_FILE) down

re:
	@docker-compose -f $(COMPOSE_FILE) up --build

clean:
	@docker-compose -f $(COMPOSE_FILE) down --volumes --remove-orphans
	@docker system prune -af --volumes
	@rm -rf srcs/accounts/__pycache__
	@rm -rf srcs/accounts/migrations/__pycache__
	@rm -rf srcs/accounts/migrations/0001_initial.py
	@rm -rf srcs/frontend/static
	@rm -rf srcs/pong_game/__pycache__

logs:
	@docker-compose -f $(COMPOSE_FILE) logs