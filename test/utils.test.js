'use strict';

var test = require('tap').test;

var assignSafe = require('../lib/utils/assign-safe');
var coerce = require('../lib/utils/coerce');
var coerceDeep = require('../lib/utils/coerce-deep');

// assign-safe

test('assignSafe throws when overwriting properties', function (t) { 
  var a = { x: 1, y: 2 };
  var b = { x: 1 };

  t.throws(function() { assignSafe(a, b); });
  t.end();
});

// coerce

test('coerce can match', function (t) { 
  var a = { x: 1, y: 2 };
  var b = { x: 1 };

  var r = coerce(a, b);

  t.is(r.errors.length, 0);
  t.end();
});

test('coerce can return errors', function (t) {
  var a = { x: 1, y: 2 };
  var b = { x: 1, y: 3 };

  var r = coerce(a, b);

  t.is(r.errors.length, 1);
  t.end();
});

// coerce-deep

test('coerceDeep can match shallow', function (t) {
  var a = { x: 1, y: 2 };
  var b = { x: 1 };

  var r = coerceDeep(a, b);

  t.is(r.errors.length, 0);
  t.is(r.list.length, 2);
  t.is(r.list['x'].both, 1);
  t.is(r.list['y'].lhs, 2);
  t.false(r.list['y'].rhs);
  t.false(r.list['y'].both);
  t.end();
});

test('can match deep', function (t) {
  var a = { x: 1, y: {} };
  var b = { x: 1, y: { z: 3 } };

  var r = coerceDeep(a, b);

  t.is(r.errors.length, 0);
  t.is(r.list.length, 2);
  t.is(r.list['x'].both, 1);
  t.is(r.list['y.z'].rhs, 3);
  t.end();
});

test('can match deep with variables', function (t) {
  var a = { x:    1, y: { z: '$Z', w: 2 } };
  var b = { x: '$A', y: { z:    3       } };

  var r = coerceDeep(a, b);

  t.is(r.errors.length, 0);
  t.is(r.list.length, 3);
  t.is(r.vars.A, 1);
  t.is(r.vars.Z, 3);
  t.same(r.list.x, {path: 'x', key: 'x', rvar: 'A', lhs: 1});
  t.same(r.list['y.z'], {path: 'y.z', key: 'z', lvar: 'Z', rhs: 3});
  t.end();
});

test('can match deep with errors', function (t) {
  var a = { x:    1, y: { z: '$Z', w: 2 } };
  var b = { x: '$A', y: { z:    3, w: 3 } };

  var r = coerceDeep(a, b);

  t.is(r.errors.length, 1);
  t.is(r.list.length, 3);
  t.is(r.vars.A, 1);
  t.is(r.vars.Z, 3);
  t.same(r.list.x, {path: 'x', key: 'x', rvar: 'A', lhs: 1});
  t.same(r.list['y.z'], {path: 'y.z', key: 'z', lvar: 'Z', rhs: 3});
  t.same(r.errors['y.w'], {path: 'y.w', key: 'w', lhs: 2, rhs: 3});
  t.end();
});

