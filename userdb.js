/**
 * Author: Mark Sherman <shermanm@mit.edu>
 *
 * Copyright 2015-2017 Mark Sherman
 *
 * License:
 *   GPL-3.0 : https://www.gnu.org/licenses/gpl-3.0.en.html
 */

var _ = require('lodash');
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var codename = require('codename')();

/*******************************************************************************
* Provides:
* .get_code_name(promise: username) - gets the code name for the provided username.
*           Returns a promise that resolves to a string
* .close() - closes database (use when shutting down)
* .db_path - path of database file
******************************************************************************/

/**
* Module that gets existing codename from real username, generating on demand
*
* @param {Object} opts - An object containing one param (`db_path`) describing
*   what file to use as the database
* @type Function
* @return {Object}
*/
module.exports = function (opts) {
  const defaults = {
    db_path: path.resolve(__dirname, 'usermap.sqlite3'),
    log_debug: false	// if log_debug is set to true, identity data may be printed to console log!
  };

  const options = _.extend({}, defaults, opts);
  const db = new sqlite3.Database(options.db_path);
  const Log = require('./loglevel.js')(options);
  const exports = {};

  /* Some utility functions, not exposed in module */

  // returns a promise that resolves true or false
  function some_name_exists (colname, username) {
    return new Promise(
      function(resolve, reject) {
        // no need to serialize, db action is read-only
        db.get("SELECT EXISTS(SELECT 1 from usermap WHERE " + colname + " = ? LIMIT 1) AS found", username,
        function(err, row){
          if( err === null ){
            if( row.found === 1 ){
              return resolve(true);
            } else if( row.found === 0 ){
              return resolve(false);
            } else {
              return reject("database did not return an expected value in some_name_exists");
            }
          } else {
            return reject("Error from database in some_name_exists: " + err )
          }
        });
      }
    );
  }

  // returns a promise that resolves true or false
  function username_exists (username) {
    return some_name_exists("username", username);
  }

  // returns a promise that resolves true or false
  function codename_exists (username) {
    return some_name_exists("codename", username);
  }

  // returns a string, NOT a promise
  function generate_random_name(){
    const tempname = codename.generate(['random'], ['cities', 'animals']);
    return tempname[0]+tempname[1];
  }

  // returns a promise
  function generate_unique_name(){
    // get a new name
    const name = generate_random_name();
    Log.debug("#UDB trying " + name);
    // check to make sure it is unique
    return codename_exists(name).then(function(value){
      Log.debug("#UDB exists value: " + value);
      if( value === false ){
        // name not found. it's unique! return it.
        Log.debug("#UDB new name: " + name );
        return name;
      } else if( value === true ) {
        // name was found, try again.
        Log.debug("#UDB name " + name + " not unique, trying again ");
        return generate_unique_name();
      } else {
        Log.error("Unexpected value from codename_exists in generate_unique_name.");
        return null;
      }
    }).catch(function(reason){
      Log.error("codename_exists searched for " + name + " and rejected with reason " + reason);
    });
  }

  const dbinit = function() {
    db.serialize(function() {
      db.run(
          'CREATE TABLE IF NOT EXISTS usermap (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, codename TEXT NOT NULL, date_added DATETIME)',
          [],
          function(err) {
            if (err !== null) {
              throw 'Error initializing database in db.run: ' + err;
            }
          });
    });
  };

  Log.log("#UDB Initializing user database (" + options.db_path + ")");
  try {
    dbinit();
  } catch (e) {
    Log.error("#UDB Error in userdb.init: ", e);
    throw e;
  }

  /**
  * The Code-Name Look-up-er
  *
  * @param {String} username - real username to look up
  * @return {String} - corresponding code name
  */
  exports.get_code_name = function(username) {
    return new Promise(
      function(resolve, reject){
        // Check if username already exists
        return username_exists(username).then(function(value) {
          if (value === true){
            // username exists, just fetch the already-existing codename
            db.get("SELECT codename FROM usermap WHERE username = ?", username,
            function(err, row){
              if( err === null ){
                return resolve(row.codename);
              } else {
                return reject("Problem with datbase in get_code_name: " + err);
              }
            });
          } else if (value === false){
            // username does not exist, insert a new codename
            return generate_unique_name().then(function(newname){
              Log.debug("#UDB about to insert username: " + username + " and codename: " + newname);
              db.run("INSERT INTO usermap (username,codename,date_added) VALUES (?,?,strftime('%s','now'))", [username, newname],
              function(err){
                if( err !== null ){
                  return reject("Error from database while inserting new user: " + err );
                }
              });
              return resolve(newname);
            });
          } else {
            return reject("Got unexpected value from username_exists in get_code_name: " + value);
          }
        });
      }
    );
  };

  /**
  * Close database (for use at system shutdown)
  *
  * @return {String} - corresponding code name
  */
  exports.close = function () {
    return db.close();
  };

  /**
  * Path of current db file
  *
  * @return {String} - path
  */
  exports.db_path = options.db_path;

  return exports;
};
