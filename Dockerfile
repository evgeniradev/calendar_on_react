FROM ruby:2.5.0-alpine
RUN apk add --update ruby-dev build-base \
  libxml2-dev libxslt-dev pcre-dev libffi-dev \
  mariadb-dev postgresql-dev qt5-qtwebkit-dev nodejs yarn curl freetds-dev git
ENV QMAKE=/usr/lib/qt5/bin/qmake
RUN mkdir /calendar_on_react
COPY Gemfile /calendar_on_react/Gemfile
COPY Gemfile.lock /calendar_on_react/Gemfile.lock
COPY package.json /calendar_on_react/package.json
COPY yarn.lock /calendar_on_react/yarn.lock
WORKDIR /calendar_on_react
RUN bundle install
RUN yarn install
CMD rails s
