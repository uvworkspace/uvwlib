'use strict';

var matcher = require('./utils/match').matcher;
var findIndex = require('./utils/find-index');
var assignExcept = require('./utils/assign-except');

// just array of objects with unique-key field and filtering utilities
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
  update: function(key, data) {
    var item = this.get(key);
    if (item) assignExcept(item, data, this.keyName);
  },
  add: function(item) { // always overwrite for the time being
    var key = item && item[this.keyName];
    if (key != null) {
      var idx = findIndex(this.items, this.keyName, key);
      if (idx < 0) {
        this.items.push(item);
      } else {
        this.items[idx] = item;
      }
      this.map[key] = item;
    }
    return this;
  },

  filter: function(opts) {
    if (!opts) return this.items;

    var fn = typeof opts === 'function' ? opts : matcher(opts);
    return this.items.filter(fn);
  },
};

module.exports = NamedList;
