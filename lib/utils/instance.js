'use strict';

var slice = Array.prototype.slice;

function instance (proto) {
  var obj = Object.create(proto);
  return proto.init && proto.init.apply(obj, slice.call(arguments, 1)) || obj;
}

module.exports = instance;
