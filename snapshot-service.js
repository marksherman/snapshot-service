/**
 * Author: Mark Sherman <shermanm@mit.edu>
 *
 * Copyright 2015-2018 Mark Sherman
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
const screencast = require('./screencast');
const userdb = require('./userdb')();

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
