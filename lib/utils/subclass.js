'use strict';

var assignArgs = require('./assign-args');

function subclass (proto) {
  return assignArgs(Object.create(proto), arguments, 1);
}

module.exports = subclass;
