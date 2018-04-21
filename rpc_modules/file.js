/**
 * Author: Mark Sherman <shermanm@mit.edu>
 *
 * Copyright 2015-2017 Mark Sherman
 *
 * The RPC module that takes file data from the client and files it.
 * The RPC client will call the "log" procedure with one argument-
 *   The one argument is a JSON object of file contents and metadata.
 *
 * Function exports.log must be a procedure that will do the filing.
 * Included are two:
 *  "saveProject" which commits, internally, to git.
 *  "consolelog" for debugging, dumping data to console
 *
 * License:
 *   GPL-3.0 : https://www.gnu.org/licenses/gpl-3.0.en.html
 */
const defaults =
    {
      'log_debug': true,
    };
var userdb = require('../userdb.js')();
const Log = require('../loglevel.js')(defaults);

const dumpToFile = false;  // consolelog can optionally dump the received JSON to file
const fs = require('fs');
const mkdirp = require('mkdirp');

/* Specifies which on-disk file saving routine to use.
 * Options currently are saveProjectToFile and saveProjectToGit */
const saveProjectTo = saveProjectToFile;

/* Directory root for collected data */
const dataDir = __dirname + '/../userFiles/';

/**
* Logs a snapshot to console.
* Can be used for debugging, but doesn't actually save anything!
*
* @param projectData {String}
*
* @return promise {Number/Error}
*   Zero upon success; Error object otherwise
*/
function consolelog (projectData) {

  var data = JSON.parse(projectData);

  if(dumpToFile){
    var filename = __dirname + "/../datadumps/" + "serialized_" + Date.now();
    fs.writeFile(filename, JSON.stringify(data), function(e){
      if(e){
        Log.error("Dump Error: " + e);
        throw e;
      } else {
        Log.debug("Dumped projectData to " + filename);
      }
    });
  }

  return userdb.get_code_name(data.userName)
  .then(function(codename)
  {
    Log.log("\n\n--------------------------------------\n");
    Log.log("Snapshot (" + data.eventType + ") received at " + new Date());
    Log.log("Codename: " + codename);
    Log.log("Sane screenName: " + sanitize(data.screenName) );
    Log.log(data);

    return Promise.resolve("0");
  })
  .catch(function(err)
  {
    Log.error("Error caught from get_code_name in consolelog: " + err);
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
* @return Promise {Number/Error}
*   Zero upon success; Error object otherwise
*/
function saveProject (projectData){

  var receiveDate = new Date();

  var data = JSON.parse(projectData);

  var userRealName = data.userName;

  return userdb.get_code_name(userRealName)
  .then(function(codename)
  {
    data.userName = codename;
    return saveProjectTo(data, receiveDate)
    .then(function(){
      return Promise.resolve("0");
    })
    .catch(function(err)
    {
      Log.error("Error caught from saveProjectTo*: " + err);
      return Promise.reject(err);
    });
  })
  .catch(function(err)
  {
    Log.error("Error caught from get_code_name in saveProject: " + err);
    return Promise.reject(err);
  });
}

/**
 * Save a snapshot to a flat file.
 * DO NOT CALL DIRECTLY - use saveProject
 *
 * Needs to return a promise that resolves.
 * The calling 'saveProject' function will then resolve for the RPC.
 *
 * @param projectData {Map}
 *
 * @param receiveDate {Date}
 *
 * @return Promise {Number/Error}
 *   Zero upon success; Error object otherwise
 */
function saveProjectToFile (projectData, receiveDate)
{
  return new Promise(function(resolve, reject)
  {
    Log.log("\nreceive started " + receiveDate);

    projectData.receiveDate = receiveDate;

    // data that becomes a file or directory name must be sanitized
    var userName        = sanitize(projectData.userName);
    var projectName     = sanitize(projectData.projectName);
    var projectId       = sanitize(projectData.projectId);
    var screenName      = strip_screen_name(sanitize(projectData.screenName));
    var sendDate        = sanitize(projectData.sendDate);

    projectData.userName = userName;
    projectData.projectName = projectName;
    projectData.projectId = projectId;
    projectData.screenName = screenName;
    projectData.sendDate = sendDate;

    // Create the directory name
    // Format: userFiles/userName/projectName#projectID.git/screen/{files}
    var projectDir = dataDir + userName + "/" + projectName + "#" + projectId;
    var screenDir = projectDir + "/" + screenName;
    var filePath = screenDir + "/snapshot_" + sendDate + ".json";

    Log.log("File to save will be: \n\t" + filePath);

    // 1. Be sure the file's directory has been created
    mkdirp(screenDir, (err) => {
      if(err){
        Log.error("Error in creating screenDir: " + err);
        reject(err);
      }
      // 2. Write the file
      fs.writeFile(filePath, JSON.stringify(projectData), function(err){
        if(err){
          Log.error("Error in writing snapshot " + filePath);
          reject(err);
        }
        Log.debug("Dumped snapshot to " + filePath);
        resolve("0");
      });
    });
  });
}

/**
 * Strips the project ID out of the Screen Name.
 * Screen name comes in from App Inventor as "5629499534213120_Screen1" (project ID and screen name)
 * It is more convenient for analysis to strip off the project ID to just "Screen1"
 *
 * If the name is already stripped, it will return it with no change. The key to knowing is the _ char.
 *
 * @param name {String}
 *
 * @return {String}
 */
function strip_screen_name (name)
{
  const index = name.indexOf('_') + 1;
  return name.slice(index);
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

module.exports = {
  log: saveProject
  //log: consolelog
};
