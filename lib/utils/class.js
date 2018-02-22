'use strict';

var initClass = require('./init-class');

function defaultInit () { return this; }

function klass (cls) {
  var kls = initClass(cls || {}, arguments, 1);

  // passing falsy cls to allow setting init later
  if (cls && !kls.hasOwnProperty('init')) { kls.init = defaultInit; }
  return kls;
}

module.exports = klass;
