#!/bin/sh

docker-compose down

docker-compose build

docker-compose run --rm calendar_on_react_app rails db:reset

echo "Setup completed"
