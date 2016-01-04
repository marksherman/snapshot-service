# snapshot-service
Server to receive and store code snapshots for learning data analysis.
Designed for [MIT App Inventor](http://appinventor.mit.edu/explore/), but can work for any text-based data collection.

Requires:
* [node.js](http://nodejs.org) v4.2+ with modules listed below
* git installed (it is used by the system as the data storage backend) (known to work at git version 1.9.1+)

##Installation
* Clone this [git repository](https://github.com/marksherman/snapshot-service).
* In the root, run ``npm install`` to download necessary extensions.

##Run Server
From root directory:
```
npm start
```
Or, from ``server`` directory, run ``node snapshot-service.js``.

##Test Client
The test client requires google's closure library as a submodule. This should be automatically downloaded during npm's installation.

Open ``client.html``, and view the javascript console. By default the client will connect to server running on localhost:8000.
There are two buttons:
* **Send Test Data**: always sends the exact same data. Useful for detecting no-change commits.
* **Jiggle and Send**: slightly modifies the data randomly and sends.

##App Inventor Client
This service is made to receive data from a snapshot-enabled branch of MIT App Inventor.
To use, clone and set up [this branch of App Inventor](https://github.com/marksherman/appinventor-sources/tree/snapshot-service).

Run app inventor locally, and it will connect to the server, above, also running locally.

I recommended opening the javascript console in the browser when using the App Inventor instance, and watching the terminal where the snapshot server is running. Both will show the snapshots as they are received, which should be on any blocks change, and more.

##Unit Tests - work in progress
Included are partial unit tests. The development dependecies were installed during ``npm install`` earlier, so testing should work after that, from root:
```
npm test
```
Or, if already in the ``server`` directory, simply run ``make test``.
