'use strict';

var assert = require('./assert');
var isObject = require('./is-object');

function assignSafe (obj) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var mixin = arguments[i];
    if (isObject(mixin)) { // object and not array
      var keys = Object.keys(mixin);
      for (var k = 0, n = keys.length; k < n; ++k) {
        var key = keys[k];
        var val = mixin[key];
        if (val !== undefined) {
          if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
            assert(false, Error('property ' + key + ' exists')); // avoid creating error
          }
          obj[key] = val;
        }
      }
    }
  }
  return obj;
}

module.exports = assignSafe;
