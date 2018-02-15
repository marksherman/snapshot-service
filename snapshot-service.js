/**
 * Author: Mark Sherman <shermanm@mit.edu>
 *
 * Copyright 2015-2017 Mark Sherman
 *
 * License:
 *   GPL-3.0 : https://www.gnu.org/licenses/gpl-3.0.en.html
 */

const rpc = require('jrpc2');
const express = require('express');
const cors = require('cors');
const app = express();
const rpcServer = new rpc.Server();
const Log = require('./loglevel.js')();

app.use(cors());

let port = 8000;
if (process.env.NODE_ENV === 'production'){
    port = 80;
}

rpcServer.loadModules(__dirname + '/rpc_modules/', function () {
  app.post('/v1.0', rpc.middleware(rpcServer));
  app.listen(port, function() {
    Log.log("server running from " + __dirname);
  });
});

rpcServer.expose('sayHello',function(){
  return Promise.resolve("Hello!");
});
