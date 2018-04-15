'use strict';

var assign = require('./assign');
var assignArgs = require('./assign-args');

function initClass (cls, args, start) {
  assign(cls, {
    __class: cls,
    instance: function () {
      var obj = Object.create(this);
      return this.init.apply(obj, arguments) || obj;
    },
    subclass: function () {
      var sub = Object.create(this);
      sub.__class = sub;
      sub.__super = cls;
      return assignArgs(sub, arguments, 0);
    }
  });
  return assignArgs(cls, args, start);
}

module.exports = initClass;
