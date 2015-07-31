var rpc = require('jrpc2');
var express = require('express');
var cors = require('cors');
var userdb = require('./userdb.js');
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

// inserts test data into and exercises user database
var testusername = function(username){
console.log("Querying username " + username);
userdb.get_code_name(username).then(function(value){
  console.log("Username: " + username + " Codename: " + value);
}).catch(function(err){
  console.log("Error in userdb.get_code_name: ", err);
});
};

["Calliope", "Clio", "Euterpe", "Erato", "Melpomene", "Polyhymnia", "Terpsichore", "Thalia", "Urania"].forEach(
  function(val, i, array){
    testusername(val);
  }
);

console.log("server running from " + __dirname);
