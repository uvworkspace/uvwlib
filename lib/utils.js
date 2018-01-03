'use strict'

function assignArgs (obj, args, start) {
  for (var len = args.length; start < len; start++) {
    var mixin = args[start]
    if (mixin && typeof mixin === 'object') {
      var keys = Object.keys(mixin)
      for (var i = 0, n = keys.length; i < n; i++) {
        obj[keys[i]] = mixin[keys[i]]
      }
    }
  }
  return obj
}

function assign (obj) {
  return obj && assignArgs(obj, arguments, 1)
}

function assignBase (cls, args, start) {
  assign(cls, {
    instance: function () {
      return this.init.apply(Object.create(this), arguments)
    },
    subclass: function () {
      return assignArgs(Object.create(this), arguments, 0)
    }
  })
  return assignArgs(cls, args, start)
}

function init () { return this }

var utils = {
  assign: assign,
  merge: function () {
    return assignArgs({}, arguments, 0)
  },
  class: function (cls) {
    cls = assignBase(cls, arguments, 1)
    cls.hasOwnProperty('init') || (cls.init = init)
    return cls
  },
  inherit: function (base) {
    var derived = Object.create(typeof base === 'function' ? base.prototype : base)
    return assignBase(derived, arguments, 1)
  }
}

module.exports = utils
