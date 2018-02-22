'use strict';

var test = require('tap').test;

var Scanner = require('../lib/scanner');

test('can match regex', function (t) {
  var str =
`HEADER
--- abc/def
ATTACH
--- ijk
LAST
`;

  var sc = Scanner.instance(str);
  t.ok(!sc.hasTerminated());
  var s = sc.scanUntil(/\n---(.*)[\n$]/);
  t.equal(s, 'HEADER\n--- abc/def\n');
  t.equal(sc.getMatch(), '\n--- abc/def\n');

  s = sc.scanUntil(/\n---(.*)[\n$]/);
  t.equal(s, 'ATTACH\n--- ijk\n');
  t.equal(sc.getMatch(), '\n--- ijk\n');

  s = sc.scanUntil(/\n---(.*)[\n$]/);
  t.false(s);
  t.false(sc.hasTerminated());

  s = sc.scanUntil(/$/);
  t.equal(s, 'LAST\n');
  t.ok(sc.hasTerminated());
  t.end();
});
