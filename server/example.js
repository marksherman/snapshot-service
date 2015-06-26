var rpc = require('jrpc2');
var express = require('express');
var cors = require('cors');
var app = express();
var rpcServer = new rpc.Server();

app.use(cors());

rpcServer.loadModules(__dirname + '/modules/', function () {
  app.post('/', rpc.middleware(rpcServer));
  app.listen(8000);
});

rpcServer.expose('sayHello',function(){
    return Promise.resolve("Hello!");
  });

console.log("server running from " + __dirname);
