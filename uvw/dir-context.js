'use strict';

var path = require('path');
var join = path.join;
var resolve = path.resolve;
var utils = require('../lib/utils');
var assert = utils.assert;
var Context = require('../context');
var nodeUtils = require('../node/utils');

var SimpleFactory = require('./simple-factory');

var NM = /^[\w\.-_]+$/;

var DirContext = Context.subclass({
  init: function(parent, name, spec, opts) {
    Context.init.call(this, parent, name, spec);
    opts = opts || {};
    spec = this.spec;

    assert(!parent || name && NM.test(name), 'missing or invalid name');
    assert(!parent || parent.path, 'missing parent.path');
    assert(parent ? parent.baseDir : spec.baseDir, 'missing baseDir');

    this._index = opts.index || null;

    if (parent) {
      this.path = parent.path.concat(name);
      this.baseDir = path.join(parent.baseDir, name);
    } else {
      this.path = [];
      this.baseDir = path.resolve(spec.baseDir);
      this._rootId = opts.rootId || this.baseDir; 
      this._factory = opts.factory || SimpleFactory.instance();
    }

    return this;
  },

  rootId: function() {
    return this.root._rootId;
  },

  _newChild: function(name, spec) {
    return DirContext.instance(this, name, spec);
  },

  _cd: function(name) {
    return this.index().cd(name);
  },

  cd: function(name) {
    return this.child(name) || this._cd(name);
  },

  filePath: function() {
    return resolve.apply(null, utils.flatten(this.baseDir, arguments));
  },

  relPathTo: function(cwd) {
    return path.relative(this.baseDir, cwd || process.cwd());
  },
  relPathFrom: function(cwd) {
    return path.relative(cwd || process.cwd(), this.baseDir);
  },
  hasFile: function() {
    return nodeUtils.isFile(this.filePath.apply(this, arguments));
  },
  hasDirectory: function() {
    return nodeUtils.isDirectory(this.filePath.apply(this, arguments));
  },

  followPath: function(relPath) {
    var p = typeof relPath === 'string' && relPath.split('/') || relPath || [];
    if (p.length === 0) {
      return { context: this, head: p, tail: p, orig: p };
    }

    var idx = 0, cur = this;
    if (p[0] === '') {
      cur = this.root;
      idx++;
    }
    while (idx < p.length) {
      if (!p[idx] || p[idx] === '.') {
      } else if (p[idx] === '..') {
        if (!cur.parent) break; 

        cur = cur.parent;
      } else {
        var ch = cur.cd(p[idx]);
        if (!ch) break;

        cur = ch;
      }
      idx++;
    }
    return {
      context: cur,
      head: p.slice(0, idx),
      tail: p.slice(idx),
      orig: p
    };
  },

  factory: function() {
    return this.root._factory;
  },

  index: function() {
    return this._index || (this._index = this.factory().createIndex(this));
  },

  setIndex: function(index) {
    assert(!this._index, 'overriding index');
    this._index = index;
    return this;
  },
});

module.exports = DirContext;
