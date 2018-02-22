'use strict';

var initClass = require('./init-class');

function defaultInit () { return this; }

// inherit an ordinary prototype or classical constructor
function inherit (base) {
  var isFn = typeof base === 'function';
  var kls = initClass(Object.create(isFn ? base.prototype : base), arguments, 1);

  if (!kls.hasOwnProperty('init')) {
    kls.init = isFn ? base : defaultInit;
  }
  return kls;
}

module.exports = inherit;
