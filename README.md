# snapshot-service
Server to receive and store code snapshots for learning data analysis.
Designed for [MIT App Inventor](http://appinventor.mit.edu/explore/), but can work for any text-based data collection.

Requires:
* [node.js](http://nodejs.org) v8.9.4+

## Installation
* Clone this [git repository](https://github.com/marksherman/snapshot-service).
* In that directory, run ``npm install`` to download necessary extensions.

## Run Server
From the root directory:
```
npm start
```
Which will start a background process you can interrogate using ``forever list``. 
(You will have to ``npm install forever -g`` to conveniently use forever without plunging into node_modules from the command line.)

To run directly for testing, use ``node snapshot-service.js``.

## MIT App Inventor
This service is made to receive data from a snapshot-enabled branch of MIT App Inventor.
To use, clone and set up [this branch of App Inventor](https://github.com/marksherman/appinventor-sources/tree/snapshot-service).

Run app inventor locally, and it will connect to the server, above, also running locally.

I recommended opening the javascript console in the browser when using the App Inventor instance, and watching the 
terminal where the snapshot server is running. Both will show the snapshots as they are received, which should be on any
blocks change, and more.

## Test Client
The text client is extremely basic and not generally useful except for development of this service.
The test client requires google's closure library as a submodule. This will be automatically downloaded during npm's installation.

Open ``client/client.html``, and view the javascript console. By default the client will connect to server running on localhost:8000.
There are three buttons, the first two work together:
* **Send Test Data**: always sends the exact same data. Useful for detecting no-change commits.
* **Jiggle and Send**: slightly modifies the data at random and sends.

The third button is to check if the server is up:

* **Say Hello to Server**: Send a hello to the server, and display if if the server says hello back.


## Unit Tests
Included are partial unit tests, using mocha and chai. From  the root dir:
```
npm test
```
