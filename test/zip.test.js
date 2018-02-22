'use strict';

var test = require('tap').test;

var Zip = require('../lib/zip');

test('can zip and get JSON', function (t) {
  var zip = Zip.instance();
  zip
  .add('foo.txt', 'FOO TEXT')
  .dir('bar')
    .add('file1.txt', 'FILE 1')
    .add('file2.txt', 'FILE 2');

  t.same(zip.toJSON(), {
    name: null,
    files: [
      { name: 'bar',
        files: [
          { name: 'file1.txt', text: 'FILE 1' },
          { name: 'file2.txt', text: 'FILE 2' }
        ]
      },
      { name: 'foo.txt', text: 'FOO TEXT' }
    ]
  });
  t.end();
});

test('can zip and get YAML', function (t) {
  var zip = Zip.instance();
  zip
  .add('foo.txt', 'FOO TEXT\nline 1')
  .dir('bar')
    .add('file1.txt', 'FILE 1\nline 2')
    .add('file2.txt', 'FILE 2\nline 3')
    .dir('cat')
      .add('file3.txt', 'FILE 3\nline 4\nline 5');

  t.matchSnapshot(zip.toYAML());
  t.end();
});
