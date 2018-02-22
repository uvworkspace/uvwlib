'use strict';

var isObject = require('./is-object');

function assignArgs (obj, args, start) {
  for (var len = args.length; start < len; ++start) {
    var arg = args[start];
    if (isObject(arg)) Object.assign(obj, arg);
  }
  return obj;
}

module.exports = assignArgs;
