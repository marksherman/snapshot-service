module.exports = {
  log: consolelog
};

var userdb = require('../userdb.js');

function consolelog (metadata, projectContents) {
  md = JSON.parse(metadata);
  contents = JSON.parse(projectContents);
  return userdb.get_code_name(md.userName).then(function(codename)
  {
    console.log("\n\n--------------------------------------\n");
    console.log("Snapshot (" + md.eventType + ") recieved at " + new Date());
    console.log("Codename: " + codename);
    console.log(md);
    console.log(contents);

    return Promise.resolve("0");
  }).catch(function(err)
  {
    console.log("Error caught from get_code_name: " + err);
    return Promise.reject(err);
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
sanitizeFilename = function(name)
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
};
