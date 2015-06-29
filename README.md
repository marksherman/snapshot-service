# snapshot-service
Server to receive and store code snapshots for learning data analysis

##Server Setup
```
cd server
npm install jrpc2 express cors bluebird
```

##Run Server
in server/
```
node example.js
```
(on linux servers the command may be `nodejs`)

##Test Client
The test client requires some submodules- dependencies that need to be downloaded. To do so, in the root directory:
```
git submodule init
git submodule update
```

Then open ```client.html```
