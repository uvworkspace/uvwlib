'use strict';

var test = require('tap').test;

var frontMatter = require('../lib/front-matter');

test('can match single yaml', function (t) {
  var txt =
`id: abc
name: def ijk
`;
  var parsed = frontMatter(txt);

  t.same(parsed, [{
    data: { id: 'abc', name: 'def ijk' },
    texts: []
  }]);
  t.end();
});

test('can match single text', function (t) {
  var txt =
`---
Hello
World
`;
  var parsed = frontMatter(txt);
  t.same(parsed, [{
    data: {},
    texts: ['Hello\nWorld\n']
  }]);
  t.end();
});

test('can match single yaml and text', function (t) {
  var txt =
`id: abc
name: def
---
Hello
World
`;
  var parsed = frontMatter(txt);
  t.same(parsed, [{
    data: {
      id: 'abc',
      name: 'def',
    },
    texts: ['Hello\nWorld\n']
  }]);
  t.end();
});

test('can match single yaml and multiple text', function (t) {
  var txt =
`id: abc
name: def
---
Hello
---
World
`;
  var parsed = frontMatter(txt);
  t.same(parsed, [{
    data: {
      id: 'abc',
      name: 'def',
    },
    texts: ['Hello\n', 'World\n']
  }]);
  t.end();
});

test('can match multiple yamls and text', function (t) {
  var txt =
`id: abc
name: def
---
Hello
--- xyz/www
id: 123 
name: "456"
---
World
---
Hi, there.
--- space betw
id: 789 
`;
  var parsed = frontMatter(txt);
  t.same(parsed, [{
    data: { id: 'abc', name: 'def' },
    texts: ['Hello\n'],
  }, {
    name: 'xyz/www',
    data: { id: 123, name: '456' },
    texts: ['World\n', 'Hi, there.\n']
  }, {
    name: 'space betw',
    data: { id: 789 },
    texts: []
  }]);
  t.end();
});

test('can match degenerated cases', function (t) {
  var txt = '';
  var parsed = frontMatter(txt);
  t.same(parsed, [{
    data: {},
    texts: []
  }]);

  txt = '---\n';
  parsed = frontMatter(txt);
  t.same(parsed, [{
    data: {},
    texts: ['']
  }]);

  txt =
`--- xyz/www
x: y
`;
  parsed = frontMatter(txt);
  t.same(parsed, [{
    data: {}, texts: [],
  }, {
    name: 'xyz/www',
    data: { x: 'y'},
    texts: []
  }]);

  txt = '--- xyz/www\n';
  parsed = frontMatter(txt);
  t.same(parsed, [{
    data: {}, texts: []
  }, {
    name: 'xyz/www',
    data: {},
    texts: []
  }]);

  txt =
`---
--- xyz/www
---
--- space betw
`;
  parsed = frontMatter(txt);
  t.same(parsed, [{
    data: {},
    texts: ['']
  }, {
    name: 'xyz/www',
    data: {},
    texts: ['']
  }, {
    name: 'space betw',
    data: {},
    texts: []
  }]);
  t.end();
});

test('can handle text with leading dashes', function (t) {
  var txt =
`id: abc
name: def
--- |
  Hello
  --- xyz/www
  id: 123
  name: "456"
  ---
  World
`;
  var parsed = frontMatter(txt);
  t.same(parsed, [{
    data: { id: 'abc', name: 'def' },
    texts: ['Hello\n--- xyz/www\nid: 123\nname: "456"\n---\nWorld\n']
  }]);
  t.end();
});


