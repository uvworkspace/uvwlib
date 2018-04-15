'use strict';

var test = require('tap').test;

var utils = require('../lib/utils');
var Scanner = require('../lib/scanner');

test('can match regex', function (t) {
  var str =
`HEADER
--- abc/def
  ---
ATTACH
--- ijk
LAST
Line
`;

  var sc = utils.instance(Scanner, str);
  t.ok(sc.hasMore());
  t.ok(!sc.finished());
  t.ok(sc.untilLine('---'));
  t.equal(sc.getResult(), 'HEADER\n');
  t.equal(sc.peek(3), '---');

  t.ok(sc.match(/---(.*)[\n$]/));
  t.equal(sc.getResult(), '--- abc/def\n');
  t.equal(sc.getMatch(1), ' abc/def');

  t.ok(sc.untilMatch(/\n---(.*)[\n$]/));
  t.equal(sc.getResult(), '  ---\nATTACH');
  t.equal(sc.getMatch(0), '\n--- ijk\n');
  t.equal(sc.getMatch(1), ' ijk');
  t.equal(sc.peek(4), '\n---');

  t.ok(sc.scanMatched());
  t.equal(sc.getResult(), '\n--- ijk\n');
  t.equal(sc.getMatch(0), '\n--- ijk\n');
  t.equal(sc.getMatch(1), ' ijk');
  t.equal(sc.peek(4), 'LAST');

  t.notOk(sc.untilLine('---'));
  t.ok(sc.hasMore());

  t.ok(sc.nextLine());
  t.equal(sc.getResult(), 'LAST\n');

  t.ok(sc.untilEnd());
  t.equal(sc.getResult(), 'Line\n');
  t.ok(sc.finished());
  t.end();
});
