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
    console.log("Sane screenName: " + sanitizeFilename(md.screenName) );
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
    return saveProjectToGit(md, pc);
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
  var             System;// = liberated.dbif.System;

  var userName        = metadata.userName;
  var projectName     = metadata.projectName;
  var projectId       = metadata.projectId;
  var screenName      = metadata.screenName;
  var sessionId       = metadata.sessionId;
  var yaversion       = metadata.yaversion;
  var languageVersion = metadata.languageVersion;
  var eventType       = metadata.eventType;

  console.log(metadata);
  console.log("GIT SAVE- USERNAME IS: " + userName );
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
function sanitizeFilename (name)
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
