'use strict';

var assignArgs = require('./assign-args');

function protoize (constructor) {
  var proto = Object.create(constructor.prototype);
  assignArgs(proto, arguments, 1);
  if (!proto.hasOwnProperty('init')) {
    proto.init = function() {
      return constructor.apply(this, arguments) || this;
    };
  }
  return proto;
}

module.exports = protoize;

