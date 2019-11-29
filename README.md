# CalendarOnReact

A React and Rails-based app that allows users to manage task records in a Calendar view.

## Supported Browsers
Google Chrome, Mozilla Firefox, Safari

## Installation

Please, use [Docker](https://docs.docker.com/) to install the app.

Run the below setup command to build the containers, create a new database and run the migrations. Please note, the command drops any existing database.
```
$ ./setup.sh
```

Start the app in development mode:
```
$ ./start.sh
```

Finally, load [http://localhost](http://localhost) in your browser.


## Running the tests

```
$ ./test.sh
```

## To-do list

* Fix IE 11 and Microsoft Edge failures
* Improve Jest and RSpec tests
* Improve error handling
* Improve design
* Add task deletion functionality
* Add time selection
