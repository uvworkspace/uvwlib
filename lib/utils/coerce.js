'use strict';

function coerce (lhs, rhs) {
  if (!lhs || typeof lhs !== 'object') lhs = {};
  if (!rhs || typeof rhs !== 'object') rhs = {};

  var result = {};
  var errors = [];

  var i, n, key, lval, rval, keys = Object.keys(lhs);
  for (i = 0, n = keys.length; i < n; i++) {
    key = keys[i];
    lval = lhs[key];
    rval = rhs[key];
    if (lval === undefined && rval !== undefined) {
      result[key] = rval;
    } else if (lval !== undefined && rval === undefined) {
      result[key] = lval;
    } else if (lval !== undefined && rval !== undefined) {
      if (lval === rval) result[key] = rval;
      else errors.push({ key: key, lhs: lval, rhs: rval });
    }
  }

  keys = Object.keys(rhs);
  for (i = 0, n = keys.length; i < n; i++) {
    key = keys[i];
    rval = rhs[key];
    if (rval !== undefined) result[key] = rval;
  }
  return {
    result: result,
    errors: errors
  };
}

module.exports = coerce;
