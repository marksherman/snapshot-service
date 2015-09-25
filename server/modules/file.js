module.exports = {
  log: saveProject
};

var userdb = require('../userdb.js');

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
* This wrapper anonymizes data for saveProjectToGit
*
* @param metadata {String}
*
* @param projectContents {String}
*
* @return {Number}
*   Zero upon success; non-zero otherwise
*/
function saveProject (metadata, projectContents){
  //consolelog(metadata, projectContents);

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
* @param metadata {String}
*
* @param projectContents {String}

* TODO remove old param descriptors below
* @param programName {}
*   The name of the program being saved
*
* @param detail {String}
*   Detail information saved with this version of the file
*
* @param code {String}
*   The program's code to be saved
*
* @param notes {String?}
*   If provided, the message to add as git notes for this commit
*
* @return {Number}
*   Zero upon success; non-zero otherwise
*
* @ignore(nodesqlite.Application.config)
* @ignore(nodesqlite.Application.config.*)
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
  var             System =  {
                              system: function(args, props) { console.log("\nSystem.system called: " + args + " w/ " + props);},
                              writeFile: function(file, content) { console.log("\nSystem.writeFile called: " + file + " : " + content);}
                            };

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

  // Create the git directory name
  // Format: userFiles/userName/projectID.git/screen/{files}
  gitDir = "./userFiles/" + userName + "/" + projectId + ".git/" + screenName;

  // Be sure the file's git directory has been created
  System.system( [ "mkdir", "-p", gitDir ]);

  // Write the blocks code to a file in the screen's directory
  try
  {
    System.writeFile( gitDir + "/blocks.xml",
                      blocks,
    {
      encoding : "utf8"
    });
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
    System.writeFile( gitDir + "/form.json",
                      form,
    {
      encoding : "utf8"
    });
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
