'use strict';

var isObject = require('./is-object');

function defaults (obj) {
  for (var i=1, len = arguments.length; i < len; ++i) {
    var arg = arguments[i];
    if (isObject(arg)) {
      Object.keys(arg).forEach(function(key) {
        if (obj[key] === undefined) obj[key] = arg[key];
      });
    }
  }
  return obj;
}

module.exports = defaults;
