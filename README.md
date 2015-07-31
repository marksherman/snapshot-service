# snapshot-service
Server to receive and store code snapshots for learning data analysis

Requires: node.js v0.12.5 with modules jrpc2 express cors bluebird

##Server Setup
```
cd server
npm install codename cors express jrpc2 sqlite3
```

##Run Server
in server/
```
node example.js
```

##Test Client
The test client requires some submodules- dependencies that need to be downloaded. To do so, in the root directory:
```
git submodule init
git submodule update
```

Then open ```client.html```

Also recommended: [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en)
