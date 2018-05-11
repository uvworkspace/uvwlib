'use strict';

function nonNull(obj) { return obj != null; }

function map (obj, fn, me, filter) {
  var ret;
  if (Array.isArray(obj)) {
    ret = me === undefined ? obj.map(fn) : obj.map(fn, me);
    if (filter) {
      ret = ret.filter(typeof filter === 'function' ? filter : nonNull);
    }
  } else {
    ret = {};
    var keys = Object.keys(obj);
    if (keys.length) {
      if (me !== undefined) fn = fn.bind(me);
      if (filter && typeof filter !== 'function') filter = nonNull;
      keys.forEach(function(key) {
        var val = fn(obj[key], key, obj);
        if (!filter || filter(val, key, obj)) ret[key] = val;
      });
    }
  }
  return ret;
}

module.exports = map;
