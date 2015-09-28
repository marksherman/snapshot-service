/**
 * Copyright (c) 2014, 2016 Derrell Lipman
 *
 * License:
 *   LGPL: http://www.gnu.org/licenses/lgpl.html
 *   EPL : http://www.eclipse.org/org/documents/epl-v10.php
 */

/*
 * This is an npm adaptation of the System module from Liberated
 * Derrell Lipman, 2016
 */

var             fs = require("fs");

/**
 * Read a file and return its data
 *
 * @param filename {String}
 *   The full or relative path to the file.
 *
 * @param options {Map?}
 *   Options for reading from the file. The available options are:
 *     encoding - The data is read as/converted to the specified
 *                encoding (defaults to "utf8")
 *
 * @param callback {Function}
 *   Callback function. Arguments to function:
 *      error {Error|null}
 *      data {String}
 *   where data is valid if error is null.
 *
 * @return {String}
 *   The data read from the file.
 */
var readFile = function(filename, options, callback)
{
  // If no options were specified...
  if (typeof options == "function")
  {
    // ... then create an empty options map
    callback = options;
    options = {};
  }

  // Set default options
  options.encoding = options.encoding || "utf8";

  // Read the file data
  fs.readFile(
    filename,
    options,
    function(error, data)
    {
      if (error)
      {
        callback(error, null);
      }

      // Convert data from "buffer" format into a string
      callback(null, data.toString());
    });
};


/**
 * Write data to a file
 *
 * @param filename {String}
 *   The name of the file to be written to
 *
 * @param data {String}
 *   The data to be written to the file
 *
 * @param options {Map?}
 *   A map of options, any of which may be omitted:
 *
 *     encoding {String}
 *       The encoding to use writing to the file. (default: "utf8")
 *
 *     mode {Number}
 *       The file creation mode. (default: 0666)
 *
 *     flag {String}
 *       The method of writing to the file, "w" to truncate then write;
 *       "a" to append. (default: "w")
 *
 * @param callback {Function}
 *   Callback function. Arguments to function:
 *      error {Error|null}
 *   File data was written if error is null.
 */
var writeFile = function(filename, data, options, callback)
{
  // If no options were specified...
  if (typeof options == "function")
  {
    // ... then create an empty options map
    callback = options;
    options = {};
  }

  // Set default options
  options.encoding = options.encoding || "utf8";
  options.mode = options.mode || 0666;
  options.flag = options.flag || "w";

  // Write the file data!
  fs.writeFile(filename, data, options, callback);
};


/**
 * Rename a file.
 *
 * @param oldName {String}
 *   The existing name of the file.
 *
 * @param newName {String}
 *   The name to move the file to.
 *
 * @param callback {Function}
 *   Callback function. Arguments to function:
 *      error {Error|null}
 *   File was renamed if error is null
 */
var rename = function(oldName, newName, callback)
{
  fs.rename(oldName, newName, callback);
};


/**
 * Read a directory and retrieve its constituent files/directories
 *
 * @param directory {String}
 *   The name of the directory to be read
 *
 * @param callback {Function}
 *   Callback function. Arguments to function:
 *      error {Error|null}
 *      files {Array}
 *
 *   If the specified directory name exists and is a directory, the
 *   returned array will be the list of files and directories found
 *   therein. Otherwise, null is returned.
 */
var readdir = function(directory, callback)
{
  fs.readdir(directory, callback);
};


/**
 * Execute a system command.
 *
 * @param cmd {Array}
 *   The command to be executed, as an array of the individual
 *   arguments, a la "argv"
 *
 * @param options {Map?}
 *   A map of options, any of which may be excluded. The options are:
 *
 *     cwd {String}
 *       The directory in which the command should be executed
 *
 *     showStdout {Boolean}
 *       If true, display any stdout output
 *
 *     showStderr {Boolean}
 *       If true, display any stderr output
 *
 * @param callback {Function}
 *   Callback function. Arguments to function:
 *      error {Error|null}
 *      data {Map}
 *
 *   The data returned map has three members:
 *
 *     exitCode {Number}
 *       0 upon successful termination of the specified command;
 *       non-zero othersise.
 *
 *     stdout {String}
 *       The standard output of the program. This may be undefined or
 *       null if exitCode was non-zero
 *
 *     stderr {String}
 *       The standard error output of the program. This may be undefined
 *       or null if exitCode was non-zero.
 */
var system = function(cmd, options, callback)
{
  var             args;
  var             localOptions = {};
  var             execFile = require("child_process").execFile;

  // Create a function in the standard async format
  function doExec(cmd, args, options, callback)
  {
    var             child;

    child = execFile(
      cmd,
      args,
      options,
      function(err, stdout, stderr)
      {
        callback(null,
                 {
                   exitCode : err == null ? 0 : err.code,
                   stdout   : stdout,
                   stderr   : stderr
                 });
      });
  }

  // If no options were specified...
  if (! options)
  {
    // ... then create an empty options map
    options = {};
  }

  // Separate the arguments from the command name
  args = cmd.slice(1);
  cmd = cmd[0];

  // Save the local options, and strip them from the options map to be
  // passed to exec
  [
    "showStdout",
    "showStderr"
  ].forEach(
    function(opt)
    {
      localOptions[opt] = options[opt];
      delete options[opt];
    });

  // Run the command
  doExec(
    cmd,
    args,
    options,
    function(error, data)
    {
      // If we were asked to display stdout...
      if (localOptions.showStdout && data.stdout.toString().length > 0)
      {
        console.log("STDOUT: " + data.stdout);
      }

      // Similarly for stderr...
      if (localOptions.showStderr && data.stderr.toString().length > 0)
      {
        console.log("STDERR: " + data.stderr);
      }

      callback(error, data);
    });
};

module.exports =
{
 readFile   : readFile,
 writeFile  : writeFile,
 rename     : rename,
 readdir    : readdir,
 system     : system
};
