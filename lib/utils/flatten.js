'use strict';

var arrayLike = require('./array-like');

function flatten (obj) {
  var len = arguments.length;
  if (len === 0) return [];
  if (len === 1 && Array.isArray(obj)) return obj;

  var arr = [];
  for (var i=0; i<len; i++) {
    var arg = arguments[i];
    if (arrayLike(arg)) {
      for (var j=0, n=arg.length; j<n; j++) arr.push(arg[j]);
    } else {
      arr.push(arg);
    }
  }
  return arr;
}

module.exports = flatten;
