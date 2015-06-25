var rpc = require('jrpc2');
var app = require('express')();
var rpcServer = new rpc.Server();

rpcServer.loadModules(__dirname + '/modules/', function () {
  app.post('/', rpc.middleware(rpcServer));
  app.listen(8000);
});

rpcServer.expose('sayHello',function(){
    return Promise.resolve("Hello!");
  });

console.log("server running from " + __dirname);
