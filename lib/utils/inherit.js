'use strict';

var initClass = require('./init-class');
var protoize = require('./protoize');

// inherit an ordinary prototype or classical constructor
function inherit (base) {
  if (typeof base === 'function') {
    return initClass(protoize.apply(null, arguments), [], 0);
  } else {
    return initClass(Object.create(base), arguments, 1);
  }
}

module.exports = inherit;
