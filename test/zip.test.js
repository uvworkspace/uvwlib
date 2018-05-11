'use strict';

var test = require('tap').test;

var utils = require('../lib/utils');
var Zip = require('../lib/zip');
var frontMatter = require('../front/front-matter');

test('can zip and get JSON', function (t) {
  var zip = utils.instance(Zip);
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

test('can zip and get YAML or front matter', function (t) {
  var zip = utils.instance(Zip);
  zip
  .add('foo.txt', 'FOO TEXT\nline 1')
  .dir('bar')
    .add('file1.txt', 'FILE 1\nline 2')
    .add('file2.txt', 'FILE 2\nline 3')
    .dir('cat')
      .add('file3.txt', 'FILE 3\nline 4\nline 5');

  t.matchSnapshot(zip.toYAML());
  t.matchSnapshot(zip.toFront());

  var fm = frontMatter(zip.toFront());
  t.equal(fm[1].name, 'bar');
  t.equal(fm[1].data.type, 'folder');
  t.equal(fm[3].name, 'bar/cat/file3.txt');
  t.equal(fm[3].data.type, 'file');
  t.equal(fm[3].texts[0], 'FILE 3\nline 4\nline 5\n');
  t.end();
});

test('can zip and get front matter', function (t) {
  var zip = utils.instance(Zip);
  zip
  .add('foo.txt', 'FOO TEXT\nline 1')
  .dir('bar')
    .add('file1.txt', 'FILE 1\n--- line 2')
    .add('file2.txt', 'FILE 2\nline 3')
    .dir('cat')
      .add('file3.txt', 'FILE 3\nline 4\nline 5');

  t.matchSnapshot(zip.toYAML());
  t.matchSnapshot(zip.toFront());

  var fm = frontMatter(zip.toFront());
  t.equal(fm[1].name, 'bar');
  t.equal(fm[1].data.type, 'folder');
  t.equal(fm[3].name, 'bar/cat/file3.txt');
  t.equal(fm[3].data.type, 'file');
  t.equal(fm[3].texts[0], 'FILE 3\nline 4\nline 5\n');
  t.end();
});
