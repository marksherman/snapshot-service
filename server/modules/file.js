module.exports = {
  log: saveProject
};

var userdb = require('../userdb.js');
var System = require('../liberated-system.js');

function consolelog (metadata, projectContents) {
  md = JSON.parse(metadata);
  contents = JSON.parse(projectContents);
  return userdb.get_code_name(md.userName).then(function(codename)
  {
    console.log("\n\n--------------------------------------\n");
    console.log("Snapshot (" + md.eventType + ") received at " + new Date());
    console.log("Codename: " + codename);
    console.log("Sane screenName: " + sanitize(md.screenName) );
    console.log(md);
    console.log(contents);

    return Promise.resolve("0");
  }).catch(function(err)
  {
    console.log("Error caught from get_code_name in consolelog: " + err);
    return Promise.reject(err);
  });
}

/**
* Save a project - call this one!
* Parses input and anonymizes data, then saves it.
*
* @param metadata {String}
*
* @param projectContents {String}
*
* @return {Number}
*   Zero upon success; non-zero otherwise
*/
function saveProject (metadata, projectContents){

  var md = JSON.parse(metadata);
  var pc = JSON.parse(projectContents);

  var userRealName = md.userName;

  return userdb.get_code_name(userRealName).then(function(codename){
    md.userName = codename;
    return saveProjectToGit(md, pc).catch(function(err){
      console.log("Error caught from saveProjectToGit: " + err);
      return Promise.reject(err);
    });
  }).catch(function(err)
  {
    console.log("Error caught from get_code_name in saveProject: " + err);
    return Promise.reject(err);
  });
}

/**
* Save a program via git.
* DO NOT CALL DIRECTLY - use saveProject
*
* Based on _saveProgram by Derrell Lipman
*
* @param metadata {Map}
*
* @param projectContents {Map}
*
* @return {Number}
*   Zero upon success; non-zero otherwise
*/
function saveProjectToGit (metadata, projectContents)
{
  var             user;
  var             ret;
  var             whoAmI;
  var             process;
  var             exitValue;
  var             reader;
  var             writer;
  var             line;
  var             cmd;
  var             hash;
  var             mailOptions;
  var             userFilesDir;// = playground.dbif.MFiles.UserFilesDir;
  var             progDir;// = playground.dbif.MFiles.ProgDir;
  var             gitDir;
  var             screenDir;
  /*var             System = {
                              system: function(args, props) { console.log("\nSystem.system called: " + args + " w/ " + props);},
                              writeFile: function(file, content) { console.log("\nSystem.writeFile called: " + file + " : " + content);}
                            };*/

  // data that becomes a real file or directory name must be sanitized
  var userName        = sanitize(metadata.userName);
  var projectName     = metadata.projectName;
  var projectId       = sanitize(metadata.projectId);
  var screenName      = sanitize(metadata.screenName);
  var sessionId       = metadata.sessionId;
  var yaversion       = metadata.yaversion;
  var languageVersion = metadata.languageVersion;
  var eventType       = metadata.eventType;

  var blocks          = projectContents.blocks;
  var form            = projectContents.form;

  //debugger;

  // Create the directory name
  // Format: userFiles/userName/projectID.git/screen/{files}
  gitDir = "./userFiles/" + userName + "/" + projectId + ".git";
  screenDir = gitDir + "/" + screenName;

  // Write an error object parsing function for System library
  var make_callback = function(function_name){
    if(function_name === "system") {
    return function(error, data){
      if (error) throw "Error in System call " + function_name + ": " + error;
      if (data.exitCode !== 0) throw "Error from shell in " + function_name + " stderr: " + data.stderr;
      console.log("Exit code: " + data.exitCode);
      console.log("stdout: " + data.stdout);
      console.log("stderr: " + data.stderr);
    };
  } else if (function_name === "writeFile") {
    return function(error){
      if(error) throw "Error in system call " + function_name;
    };
  }
  };

  // Be sure the file's directory has been created
  try {
    System.system( [ "mkdir", "-p", screenDir ], { showStdout : true }, make_callback("system"));
  } catch (e) {
    console.log("\n\nFailed to create directory at " +
    gitDir + "/blocks.xml" +
    ": " + e + "\n\n");
  }

  // Write the blocks code to a file in the screen's directory
  try
  {
    System.writeFile( screenDir + "/blocks.xml", blocks,
    { encoding : "utf8" }, make_callback("writeFile"));
  }
  catch (e)
  {
    console.log("\n\nFailed to create user code at " +
    gitDir + "/blocks.xml" +
    ": " + e + "\n\n");
  }

  // Write the component code (form) to a file in the screen's directory
  try
  {
    System.writeFile( screenDir + "/form.json", form,
    { encoding : "utf8" }, make_callback("writeFile"));
  }
  catch (e)
  {
    console.log("\n\nFailed to create user code at " +
    gitDir + "/form.json" +
    ": " + e + "\n\n");
  }


  return Promise.resolve("0");
}

/**
* Sanitize a file name by replacing ".." with "DOTDOT", backslash with
* slash, multiple adjacent slashes with a single slash, and any remaining
* slash with "SLASH".
*
* @author Derrell Lipman
* @param name {String}
*   The file name to be sanitized
*
* @return {String}
*   The sanitized file name
*/
function sanitize (name)
{
  // Remove dangerous ..
  name = name.replace(/\.\./g, "DOTDOT");

  // Replace backslashes with forward slashes
  name = name.replace(/\\/g, "/");

  // Strip any double slashes; replace with single slashes
  name = name.replace(/\/+/g, "/");

  // Replace dangerous slashes
  name = name.replace(/\//g, "SLASH");

  return name;
}
