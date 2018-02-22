'use strict';

function varName(s, prefix) {
  // no empty var name
  return (prefix && typeof s === 'string' && s[0] === prefix && s.slice(1)) || null;
}

function coerce(lhs, rhs, ret, cur, path, depth, prefix) {
  if (depth < 0) {
    ret.errors.push(errors[path] = { path: path, error: 'too deep' });
    return;
  }

  var errors = ret.errors;
  var list = ret.list;
  var vars = ret.vars;
 
  var i, n, key, p, lval, rval, lvar, rvar;
  var keys = Object.keys(lhs);
  for (i=0, n=keys.length; i<n; i++) {
    key = keys[i];
    lval = lhs[key];
    rval = rhs[key];
    lvar = varName(lval, prefix);
    rvar = varName(rval, prefix);
    p = path ? path + '.' + key : key;
    if (lvar && rvar) {
      errors.push(errors[p] = { path: p, key: key, lvar: lver, rvar: rvar });
    } else if (lvar) {
      if (rval === undefined) {
        errors.push(errors[p] = { path: p, key: key, lvar: lver });
      } else {
        cur[key] = vars[lvar] = rval;
        list.push(list[p] = { path: p, key: key, lvar: lvar, rhs: rval });
      }
    } else if (rvar) {
      if (lval === undefined) {
        errors.push(errors[p] = { path: p, key: key, rvar: rvar });
      } else {
        cur[key] = vars[rvar] = lval;
        list.push(list[p] = { path: p, key: key, rvar: rvar, lhs: lval });
      }
    } else if (lval === undefined && rval !== undefined) {
      cur[key] = rval;
      list.push(list[p] = { path: p, key: key, rhs: rval });
    } else if (lval !== undefined && rval === undefined) {
      cur[key] = lval;
      list.push(list[p] = { path: p, key: key, lhs: lval });
    } else if (lval !== undefined && rval !== undefined) {
      if (lval === rval) {
        cur[key] = lval;
        list.push(list[p] = { path: p, both: lval });
      } else if (lval && rval && typeof lval === 'object' && typeof rval === 'object') {
        coerce(lval, rval, ret, cur[key] = {}, p, depth - 1, prefix);
      } else {
        errors.push(errors[p] = { key: key, path: p, lhs: lval, rhs: rval });
      }
    }
  }

  keys = Object.keys(rhs);
  for (i=0, n=keys.length; i<n; i++) {
    key = keys[i];
    rval = rhs[key];
    if (rval !== undefined && !cur.hasOwnProperty(key)) {
      rvar = varName(rval, prefix);
      if (rvar) {
        errors.push(errors[p] = { path: p, key: key, rvar: rvar });
      } else {
        p = path ? path + '.' + key : key;
        cur[key] = rval;
        list.push(list[p] = { path: p, rhs: rval });
      }
    }
  }

  return ret;
}

function coerceDeep(lhs, rhs, opts) {
  opts = opts || {};
  if (!lhs || typeof lhs !== 'object') lhs = {};
  if (!rhs || typeof rhs !== 'object') rhs = {};

  var depth = opts.depth > 0 ? opts.depth : 5;
  var prefix = opts.prefix || '$';

  var ret = {
    result: {},
    list: [],
    errors: []
  };
  if (prefix) ret.vars = {};
  coerce(lhs, rhs, ret, ret.result, '', depth, prefix);
  return ret;
}

module.exports = coerceDeep;
