'use strict';

var assignArgs = require('./assign-args');

function proto (first) {
  var kls = assignArgs({}, arguments, 0); // ok pssing arguments

  // can pass falsy first arguments to omit setting init constructor
  if (first && !kls.hasOwnProperty('init')) {
    kls.init = function() { return this; }
  }
  return kls;
}

module.exports = proto;

