'use strict';

var assign = require('./assign');
var assignArgs = require('./assign-args');

function initClass (cls, args, start) {
  assign(cls, {
    instance: function () {
      return this.init.apply(Object.create(this), arguments);
    },
    subclass: function () {
      return assignArgs(Object.create(this), arguments, 0);
    }
  });
  return assignArgs(cls, args, start);
}

module.exports = initClass;
