'use strict';

function each (obj, fn, me) {
  if (Array.isArray(obj)) {
    obj.forEach(fn, me);
  } else {
    if (me) fn = fn.bind(me);
    Object.keys(obj).forEach(function(key) {
      fn(obj[key], key, obj);
    });
  }
}

module.exports = each;
