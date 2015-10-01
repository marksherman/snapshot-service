/**
* Used by Mark Sherman for development of promise-system.js
* Not expected to provide any consistent or useful features.
*/

var sys = require('./promise-system.js');

var makeThen = function(name){
  return function(data)
  {
    console.log("\n" + name + " success:");
    if (typeof data == "string"){
      data.split('\n').map(function(cur,i,a){console.log("| " + cur);});
    } else {
      console.log(data);
    }
  };
};

var makeCatch = function(name){
  return function(err)
  {
    console.log("\nerror from " + name + "!");
    console.log(err);
  };
};

var date = new Date();
var testfile = 'TEST_' + date.getTime() + '.txt';

console.log("\n@@@@@@ STARTING TESTS " + testfile);
/*****************************************************************************/

var p1 = sys.readdir('.')
  .then(
    function(data){
      console.log("ls . at start");
      makeThen("readdir")(data);
    },
    makeCatch("readdir"));

var p2 = sys.writeFile(
      testfile,
      "Time: " + date.toTimeString() + "\nSecond line..... \n" +
      "This is file " + testfile + "\n"
    )
    .then(
      function(data){
        makeThen("writeFile")(data);

        sys.readFile(testfile)
        .then(
          function(data){
            makeThen("readFile")(data);

            sys.rename(testfile, 'TEST_RENAMED_' + date.getTime() + '.txt')
            .then(
              function(data){
                makeThen("rename")(data);
              },
              makeCatch("rename"));

            },
            makeCatch("readFile"));
          },

          makeCatch("writeFile"));
