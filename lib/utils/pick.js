'use strict';

var arrayLike = require('./array-like');

function pick (obj, names) {
  var picked = {};
  if (!obj || typeof obj !== 'object') return picked;

  var i = 0;
  if (!arrayLike(names)) {
    names = arguments;
    i = 1;
  }

  for (var len = names.length; i < len; i++) {
    var name = names[i];
    var val = obj[name];
    if (val !== undefined) picked[name] = val;
  }
  return picked;
}

module.exports = pick;
