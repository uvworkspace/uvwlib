'use strict';

function match (obj) {
  if (!obj || typeof obj !== 'object') return false;

  for (var i = 1, argn = arguments.length; i < argn; i++) {
    var pat = arguments[i];
    var keys = Object.keys(pat);
    for (var i = 0, n = keys.length; i < n; i++) {
      var key = keys[i];
      var val = pat[key];
      if (val !== undefined && obj[key] !== val) return false;
    }
  }
  return true;
}

match.matcher = function () {
  var args = arguments;
  return function (obj) {
    return match.bind(null, obj).apply(null, args);
  };
};

module.exports = match;
