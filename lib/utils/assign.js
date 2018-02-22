'use strict';

var assignArgs = require('./assign-args');

// Unlike Object.assign, skip non-objects and arrays
function assign (obj) {
  return obj && assignArgs(obj, arguments, 1);
}

module.exports = assign;
