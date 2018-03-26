/**
 * Author: Mark Sherman <shermanm@mit.edu>
 *
 * Copyright 2015-2017 Mark Sherman
 *
 * License:
 *   GPL-3.0 : https://www.gnu.org/licenses/gpl-3.0.en.html
 */

var rpc = require('jrpc2');
var express = require('express');
var cors = require('cors');
var app = express();
var rpcServer = new rpc.Server();
var Log = require('./loglevel.js')();

app.use(cors());

app.get('/', (req, res) => res.send('Snapshot Receiver Server'));

rpcServer.loadModules(__dirname + '/rpc_modules/', function () {
  app.post('/v1.0', rpc.middleware(rpcServer));
  app.listen(8000, function() {
    Log.log("server running from " + __dirname);
  });
});

rpcServer.expose('sayHello',function(){
  return Promise.resolve("Hello!");
});
