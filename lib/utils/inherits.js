'use strict';

function inherits (baseConstructor, childConstructor) {
  var proto = childConstructor.prototype = Object.create(baseConstructor.prototype);
  proto.constructor = childConstructor;
  return proto;
}

module.exports = inherits;
