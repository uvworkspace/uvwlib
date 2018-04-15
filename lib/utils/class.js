'use strict';

var initClass = require('./init-class');

function klass (cls) {
  var kls = initClass({}, arguments, 0);

  // passing falsy cls to allow setting init later
  if (cls && !kls.hasOwnProperty('init')) {
    kls.init = function() { return this; }
  }
  return kls;
}

module.exports = klass;
