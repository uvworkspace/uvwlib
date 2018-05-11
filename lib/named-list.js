'use strict';

var map = require('./utils/map');
var matcher = require('./utils/match').matcher;
var findIndex = require('./utils/find-index');
var assert = require('./utils/assert');
var assignExcept = require('./utils/assign-except');

// just array of objects with null or unique-key field and filtering utilities
var NamedList = {
  instance: function(opts, keyName) {
    return Object.create(NamedList).init(opts, keyName);
  },

  init: function(opts, keyName) {
    if (typeof opts === 'string') {
      opts = { key: opts };
    } else if (Array.isArray(opts)) {
      opts = { items: opts, key: keyName }
    } else {
      opts = opts || {};
    }

    this.allowNullKey = !!opts.nullKey;
    this.keyName = opts.key || 'name';
    this.items = [];
    this.map = {};
    this.reset(opts.items);
    return this;
  },

  reset: function(items) {
    this.items.length = 0;
    this.map = {};
    if (Array.isArray(items)) {
      for (var i=0; i<items.length; i++) {
        this.add(items[i]);
      }
    }
  },
  get: function(key) {
    if (key != null) return this.map[key];
  },
  getAt: function(idx) {
    return this.items[idx];
  },
  update: function(key, data) {
    var item = this.get(key);
    if (item) assignExcept(item, data, this.keyName);
  },
  updateAt: function(idx, data) {
    var item = this.items[idx];
    if (item) assignExcept(item, data, this.keyName);
  },

  add: function(item) { // always overwrite for the time being
    if (!item) return this;

    var key = item[this.keyName];
    if (key != null) {
      if (this.map[key]) {
        var idx = findIndex(this.items, this.keyName, key);
        assert(idx >= 0, 'item in map but not in items');
        this.items[idx] = item;
      } else {
        this.items.push(item);
      }
      this.map[key] = item;
    } else if (this.allowNullKey) {
      // can have duplicates
      this.items.push(item);
    }
    return this;
  },

  indexOf: function(item) {
    return item ? this.items.indexOf(item) : -1;
  },

  has: function(item) {
    return this.indexOf(item) >= 0;
  },

  each: function(fn, me) {
    this.items.forEach(fn, me);
  },
  map: function(fn, me, filter) {
    return map(this.items, fn, me, filter);
  },

  filter: function(opts, me) {
    if (!opts) return this.items;

    var fn = typeof opts === 'function' ? opts : matcher(opts);
    return this.items.filter(fn, me === undefined ? this : me);
  },
};

module.exports = NamedList;
