# snapshot-service
Server to receive and store code snapshots for learning data analysis.
Designed for [MIT App Inventor](http://appinventor.mit.edu/explore/), but can work for any text-based data collection.

Requires:
* [node.js](http://nodejs.org) v4.2+ with modules listed below
* git installed (it is used by the system as the data storage backend) (known to work at git version 1.9.1+)

##Server Setup
```
cd server
npm install codename cors express jrpc2 sqlite3 lodash path
```

##Run Server
in server/
```
node snapshot-service.js
```
##Test Client

The test client requires google's closure library as a submodule. This dependency needs to be downloaded. To do so, in the root directory:
```
git submodule init
git submodule update
```

Then open ```client.html```, and view the javascript console. By default the client will connect to server running on localhost:8000.
There are two buttons:
* Send Test Data: always sends the exact same data. Useful for detecting no-change commits.
* Jiggle and Send: slightly modifies the data randomly and sends.

##App Inventor Client
This service is made to receive data from a snapshot-enabled branch of MIT App Inventor.
To use, clone and set up [this branch of App Inventor](https://github.com/marksherman/appinventor-sources/tree/snapshot-service).

Run app inventor locally, and it will connect to the server, above, also running locally.

I recommended opening the javascript console in the browser when using the App Inventor instance, and watching the terminal where the snapshot server is running. Both, at time of writing, will show the snapshots as they are received, which should be on any blocks change, and more.

##Unit Tests - incomplete
Included are partial unit tests, which require mocha, chai, and chai-as-promised. The promise-system local filesystem unit and the anonymizer unit are currently well exercised by the unit tests.
```
cd server
npm install mocha chai chai-as-promised
make test
```
