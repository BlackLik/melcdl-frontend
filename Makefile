MODE ?= local

COMPOSE_DIR := deployment
COMPOSE_FILE := $(COMPOSE_DIR)/docker-compose.${MODE}.yaml

DOCKER := docker-compose -f $(COMPOSE_FILE)

.PHONY: lint
lint:
	npm run format
	npm run lint

.PHONY: run
run: build up clean

.PHONY: build
build:
	${DOCKER} build

.PHONY: up
up:
	${DOCKER} up --force-recreate -d

.PHONY: clean
clean:
	docker container prune -f
	docker image prune -f
