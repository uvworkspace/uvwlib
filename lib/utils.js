'use strict';

// Unlike Object.assign, skip non-objects and arrays

function assign (obj) {
  return obj && assignArgs(obj, arguments, 1);
}

function assignArgs (obj, args, start) {
  for (var len = args.length; start < len; start++) {
    var mixin = args[start];
    if (mixin && typeof mixin === 'object' && !Array.isArray(mixin)) {
      Object.assign(obj, mixin);
    }
  }
  return obj;
}

function assignBase (cls, args, start) {
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

function init () { return this; }

var utils = {
  assign: assign,
  assignArgs: assignArgs,
  merge: function () {
    return assignArgs({}, arguments, 0);
  },
  class: function (cls) {
    cls = assignBase(cls, arguments, 1);
    cls.hasOwnProperty('init') || (cls.init = init);
    return cls;
  },
  inherit: function (base) {
    var derived = Object.create(typeof base === 'function' ? base.prototype : base);
    return assignBase(derived, arguments, 1);
  }
};

module.exports = utils;
