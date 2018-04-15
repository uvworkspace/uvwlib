'use strict';

var assign = require('./assign');
var isObject = require('./is-object');

function isIn(arr) {
  return function(key) { return arr.indexOf(key) >= 0; }
}
function hasKey(keys) {
  return function(key) { return keys[key]; }
}

function assignExcept (obj, data, excepts) {
  if (!obj || !data) return obj;
  if (typeof obj !== 'object' || !isObject(data)) return obj;
  if (!excepts) return assign(obj, data);

  var keys = Object.keys(data), len = keys.length, i, key;
  if (!len) return obj;

  if (typeof excepts === 'string') {
    for (i=0; i<len; i++) {
      if ((key = keys[i]) !== excepts) obj[key] = data[key];
    }
  } else {
    var fn = typeof excepts === 'function' ? fn
      : (Array.isArray(excepts) ? isIn(excepts) : hasKey(excepts));

    for (i=0; i<len; i++) {
      if (!fn(key = keys[i])) obj[key] = data[key];
    }
  }
  return obj;
}

module.exports = assignExcept;
