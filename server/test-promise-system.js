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
 Promise.all([

  sys.readdir('.')
  .then(
    function(data){
      console.log("ls . at start");
      makeThen("readdir")(data);
    },
    makeCatch("readdir")),

    sys.writeFile(
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

          makeCatch("writeFile")),

        sys.system(['ls', '-la'],{ showStdout : true , showStderr : true}).then(
          function(data){
            makeThen("system")(data.exitCode);
            makeThen("system")(data.stdout);
          }, makeCatch("system"))

        ]).then(function(data)
        {
          makeThen("ALL")();

          sys.system(['rm', '-f', 'TEST_*'], { showStdout : false})
          .then(makeThen("system/rm"),makeCatch("system/rm"));
        },
        makeCatch("ALL"));
