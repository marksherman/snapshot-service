/**
 * Author: Mark Sherman <shermanm@mit.edu>
 *
 * Copyright 2015-2017 Mark Sherman
 *
 * License:
 *   GPL-3.0 : https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Set a flag to true to make that category print to console.
 * Flags can be passed as an option object at invocation.
 * See defaults object below.
 */
var _ = require('lodash');

var defaults = {
  log_error: true,
  log_utility: true,
  log_debug: true
};

var silent_function     = function() { };

module.exports = function(opts) {
  var options = _.extend({}, defaults, opts);
  var exports = {};

  exports.error   = options.log_error   ? console.error  : silent_function;
  exports.log     = options.log_utility ? console.log    : silent_function;
  exports.debug   = options.log_debug   ? console.log    : silent_function;

  exports.silent = silent_function;

  return exports;
};
