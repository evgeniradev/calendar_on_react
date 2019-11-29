#!/bin/sh

docker-compose run --rm calendar_on_react_app /bin/sh -c "yarn test && bundle exec rspec"
