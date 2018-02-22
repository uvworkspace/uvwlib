'use strict';

var test = require('tap').test;

var frontMatter = require('../lib/front-matter');

test('can match single yaml', function (t) {
  var txt =
`id: abc
name: def ijk
`;
  var parsed = frontMatter(txt);

  t.same(parsed, { id: 'abc', name: 'def ijk' });
  t.end();
});

test('can match single text', function (t) {
  var txt =
`---
Hello
World
`;
  var parsed = frontMatter(txt);
  t.same(parsed, {
    __content: 'Hello\nWorld\n',
    __contents: ['Hello\nWorld\n']
  });
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
  t.same(parsed, {
    id: 'abc',
    name: 'def',
    __content: 'Hello\nWorld\n',
    __contents: ['Hello\nWorld\n']
  });
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
  t.same(parsed, {
    id: 'abc',
    name: 'def',
    __content: 'Hello\n',
    __contents: ['Hello\n', 'World\n']
  });
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
  t.same(parsed, {
    id: 'abc',
    name: 'def',
    __content: 'Hello\n',
    __contents: ['Hello\n'],
    __children: [{
      name: 'xyz/www',
      data: { id: 123, name: '456' },
      texts: ['World\n', 'Hi, there.\n']
    }, {
      name: 'space betw',
      data: { id: 789 }
    }]
  });
  t.end();
});

test('can match degenerated cases', function (t) {
  var txt = '';
  var parsed = frontMatter(txt);
  t.same(parsed, {});

  txt = '---\n';
  parsed = frontMatter(txt);
  t.same(parsed, {});

  txt =
`--- xyz/www
x: y
`;
  parsed = frontMatter(txt);
  t.same(parsed, {
    __children: [{
      name: 'xyz/www',
      data: { x: 'y'}
    }]
  });

  txt = '--- xyz/www\n';
  parsed = frontMatter(txt);
  t.same(parsed, {
    __children: [{
      name: 'xyz/www',
      data: {}
    }]
  });

  txt =
`---
--- xyz/www
---
--- space betw
`;
  parsed = frontMatter(txt);
  t.same(parsed, {
    __content: '\n',
    __contents: ['\n'],
    __children: [{
      name: 'xyz/www',
      data: {},
      texts: ['\n']
    }, {
      name: 'space betw',
      data: {}
    }]
  });
  t.end();
});
