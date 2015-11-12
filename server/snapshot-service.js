/**
 * Author: Mark Sherman <msherman@cs.uml.edu>
 *
 * Copyright 2015 Mark Sherman
 *
 * License:
 *   Apache : http://www.apache.org/licenses/LICENSE-2.0.txt
 */

var rpc = require('jrpc2');
var express = require('express');
var cors = require('cors');
var userdb = require('./userdb.js');
var app = express();
var rpcServer = new rpc.Server();
var Log = require('./loglevel.js');

app.use(cors());

rpcServer.loadModules(__dirname + '/modules/', function () {
  app.post('/', rpc.middleware(rpcServer));
  app.listen(8000);
});

rpcServer.expose('sayHello',function(){
  return Promise.resolve("Hello!");
});

// inserts test data into and exercises user database
function testusername (username){
  Log.debug("Querying username " + username);
  userdb.get_code_name(username).then(function(value){
    Log.debug("Username: " + username + " Codename: " + value);
  }).catch(function(err){
    Log.error("Error in userdb.get_code_name: ", err);
  });
}

function do_userdb_tests (){
  ["Calliope", "Clio", "Euterpe", "Erato", "Melpomene", "Polyhymnia", "Terpsichore", "Thalia", "Urania"].forEach(
    function(val, i, array){
      testusername(val);
    }
  );
}

//do_userdb_tests();

Log.log("server running from " + __dirname);
