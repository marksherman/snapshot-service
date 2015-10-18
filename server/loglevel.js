/**
 * Author: Mark Sherman <msherman@cs.uml.edu>
 * Part of snapshot-service, by Mark Sherman
 *
 * Set a flag to true to make that category print to console.
 */

/***********************************************/

var flag_error   = true;
var flag_general = true;
var flag_debug   = true;

/***********************************************/

var log_func        = console.log;
var error_log_func  = console.error;
var silent_func     = function(m) {};

var logerr = flag_error   ? error_log_func  : silent_function;
var loggen = flag_general ? log_func    : silent_function;
var logbug = flag_debug   ? log_func    : silent_function;

module.exports =
{
  err   : logerr,
  error : logerr,

  log   : loggen,

  bug   : logbug,
  debug : logbug
};
