'use strict';

function deref(path, obj, create) {
  if (!obj || typeof obj !== 'object') return;

  if (typeof path === 'string') path = path.split('.');

  for (var i=0, len=path.length; i<len; i++) {
    var attr = obj[path[i]];
    if (attr === undefined) {
      if (!create) return;
      attr = obj[path[i]] = {};
    } else if (!attr || typeof attr !== 'object') {
      return;
    }
    obj = attr;
  }
  return obj;
};

deref.p = function (path, obj) {
  return deref(path, obj, true);
};
deref.set = function (path, obj, key, val) {
  obj = deref(path, obj, true);
  if (!obj) return false;

  obj[key] = val;
  return true;
};

module.exports = deref;

