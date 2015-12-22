/**
 * Author: Mark Sherman <msherman@cs.uml.edu>
 *
 * Copyright 2015 Mark Sherman
 *
 * License:
 *   Apache : http://www.apache.org/licenses/LICENSE-2.0.txt
 */

var userdb = require('../userdb.js')();
var System = require('../promise-system.js');
var Log = require('../loglevel.js');

/**
* Logs a snapshot to console.
* Can be used for debugging, but doesn't actually save anything!
*
* @param metadata {String}
*
* @param projectContents {String}
*
* @return promise {Number/Error}
*   Zero upon success; Error object otherwise
*/
function consolelog (projectData) {
  data = JSON.parse(projectData);
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
* @return promise {Number/Error}
*   Zero upon success; Error object otherwise
*/
function saveProject (projectData){

  var data = JSON.parse(projectData);

  var userRealName = data.userName;

  return userdb.get_code_name(userRealName)
  .then(function(codename)
  {
    data.userName = codename;
    return saveProjectToGit(data).catch(function(err)
    {
      Log.error("Error caught from saveProjectToGit: " + err);
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
* Save a program via git.
* DO NOT CALL DIRECTLY - use saveProject
*
* Based on _saveProgram, part of LearnCS by Derrell Lipman
* github.com/derrell/LearnCS
*
* @param metadata {Map}
*
* @param projectContents {Map}
*
* @return promise {Number/Error}
*   Zero upon success; Error object otherwise
*/
function saveProjectToGit (projectData)
{
  return new Promise(function(resolve, reject)
  {
    var date = Date();
    Log.log("Recieve started " + date);
    // data that becomes a file or directory name must be sanitized
    var userName        = sanitize(projectData.userName);
    var projectName     = sanitize(projectData.projectName);
    var projectId       = sanitize(projectData.projectId);
    var screenName      = sanitize(projectData.screenName);
    var sessionId       = projectData.sessionId;
    var yaversion       = projectData.yaversion;
    var languageVersion = projectData.languageVersion;
    var eventType       = projectData.eventType;

    var detail          = "committed automatically by snapshot server";
    var notes           = null;

    var blocks          = projectData.blocks;
    var form            = projectData.form;

    // Create the directory name
    // Format: userFiles/userName/projectID.git/screen/{files}
    var gitDir = "./userFiles/" + userName + "/" + projectName + "#" + projectId + ".git";
    var screenDir = gitDir + "/" + screenName;

    var blocksfile = "blocks.xml";
    var formfile = "form.json";

    Log.log("Files to commit will be: \n\t" +
      screenDir + "/" + blocksfile + "\n\t" +
      screenDir + "/" + formfile);

    // 1. Be sure the file's directory has been created
    Log.debug(date + " 1");
    return System.system(
      [ "mkdir", "-p", screenDir ],
      { showStdout : true })
      .then(
        function(data)
        {
          // 2. Write the blocks code to a file in the screen's directory
          Log.debug(date + " 2");
          return System.writeFile( screenDir + "/" + blocksfile, blocks);
        })
      .then(
        function(data)
        {
          // 3. Write the component code (form) to a file in the screen's directory
          Log.debug(date + " 3");
          return System.writeFile( screenDir + "/" + formfile, form);
        })
      .then(
        function(data)
        {
          // 4 Create the git repository
          Log.debug(date + " 4");
          return System.system([ "git", "init" ],
                         {
                           cwd        : gitDir,
                           showStdout : true
                         });
        })
      .then(
        function(data)
        {
          // 5 Identify the user to git
          Log.debug(date + " 5");
          return System.system( [
                           "git",
                           "config",
                           "user.name",
                           userName
                         ],
                         {
                           cwd        : gitDir,
                           showStdout : true
                         } );
        })
      .then(
        function(data)
        {
          // 6 Identify user's (fake) email to git
          Log.debug(date + " 6");
          return System.system( [
                           "git",
                           "config",
                           "user.email",
                           "anonymous@noplace.at.all"
                         ],
                         {
                           cwd        : gitDir,
                           showStdout : true
                         } );
        })
      .then(
        function(data)
        {
          // 7 Add files to this git repository
          Log.debug(date + " 7");
          Log.debug("cwd : " + screenDir);
          Log.debug("files: " + blocksfile + " , " + formfile);
          return System.system( [
                          "git",
                          "add",
                          blocksfile,
                          formfile
                        ],
                         {
                           cwd        : screenDir,
                           showStdout : true
                         } );
        }
      )
      .then(
        function(data)
        {
          // 8 Commit files
          Log.debug(date + " 8");
          return System.system(
            [
              "git",
              "commit",
              "-m",
              detail,
              "--"//,
              //screenDir + "/" + blocksfile,
              //screenDir + "/" + formfile
            ],
            {
              cwd        : gitDir,
              showStdout : true
            } );

        }
      )
      .then(
        function(data)
        {
          // 9 Did the commit succeed?
          Log.debug(date + " 9S");
          if (data.exitCode === 0)
          {
            // Succeded! Were notes specified?
            Log.debug(date + " 9A");
            if (notes)
            {
              Log.debug(date + " 9 Notes");
              return System.system(
                [
                  "git",
                  "notes",
                  "append",
                  "-m",
                  notes + "\n-----\n"
                ],
                {
                  cwd        : gitDir,
                  showStdout : true
                } );
            }
            else
            {
              Log.debug(date + " 9 No Notes");
              return data;
            }
          }
        },
        function(err)
        {
            // Commit did not succeed
            Log.error(err.stderr);

            // 9F1 Check out the most recent version
            Log.debug(date + " 9F1");
            return System.system(
              [
                "git",
                "checkout",
                blocksfile,
                formfile
              ],
              {
                cwd        : screenDir,
                showStdout : true
              })
              .then(function(data)
                {
                  // 9F2 Append the commit mesasge as notes
                  Log.debug(date + " 9F2");
                  return System.system(
                    [
                      "git",
                      "notes",
                      "append",
                      "-m",
                      detail + (notes ? "\n" : "\n-----\n")
                    ],
                    {
                      cwd        : gitDir,
                      showStdout : true
                    } );
                })
              .then(function(data)
              {
                // 9F3 Were notes specified too?
                Log.debug(date + " 9F3");
                if (notes)
                {
                  return System.system(
                    [
                      "git",
                      "notes",
                      "append",
                      "-m",
                      notes + "\n-----\n"
                    ],
                    {
                      cwd        : gitDir,
                      showStdout : true
                    } );
                }
                else
                {
                  return data; //noop, return current promise
                }
              });
              // end of commit-failed case
          }
      )
      // TODO add post-commit options and features, @ MFiles.js:277
      .catch(
        function(error){
          Log.debug("Error in system calls in saveProjectToGit: " + error);
          reject(error);
        });

  });
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
