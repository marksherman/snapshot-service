# snapshot-service
Server to receive and store code snapshots for learning data analysis.
Designed for [MIT App Inventor](http://appinventor.mit.edu/explore/), but will work for any text-based data collection.

Requires:
* [node.js](http://nodejs.org) v4.1.1+ with modules listed below
* git installed (it is used by the system as the data storage backend) (known to work at git version 1.9.1+)

##Server Setup
```
cd server
npm install codename cors express jrpc2 sqlite3
```

##Run Server
in server/
```
node snapshot-service.js
```

##App Inventor Client
This service is made to receive data from a snapshot-enabled branch of MIT App Inventor.
To use, clone and set up [this branch of App Inventor](https://github.com/marksherman/appinventor-sources/tree/snapshot-service).

Run app inventor locally, and it will connect to the server, above, also running locally.

I recommended opening the javascript console in the browser when using the App Inventor instance, and watching the terminal where the snapshot server is running. Both, at time of writing, will show the snapshots as they are received, which should be on any blocks change, and more.

###Test Client - deprecated
*This section is deprecated and for reference only. It provides a basic example of how to send data to the server.*

The test client requires google's closure library as a submodule. This dependency needs to be downloaded. To do so, in the root directory:
```
git submodule init
git submodule update
```

Then open ```client.html```, and view the javascript console.

Also recommended: [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en)
