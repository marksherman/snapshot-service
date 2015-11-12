/**
 * Author: Mark Sherman <msherman@cs.uml.edu>
 *
 * Copyright 2015 Mark Sherman
 *
 * License:
 *   Apache : http://www.apache.org/licenses/LICENSE-2.0.txt
 * Set a flag to true to make that category print to console.
 */

/***********************************************/

var flag_error   = true;
var flag_utility = true;
var flag_debug   = false;

/***********************************************/

var silent_function     = function(m) {};

var logerr  = flag_error   ? console.error  : silent_function;
var logutil = flag_utility ? console.log    : silent_function;
var logbug  = flag_debug   ? console.log    : silent_function;

module.exports =
{
  log   : logutil,
  error : logerr,
  bug   : logbug,
  debug : logbug
};
