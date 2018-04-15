'use strict';

var bsearch = require('./utils/bsearch');
var matcher = require('./utils/match').matcher;
var assignExcept = require('./utils/assign-except');

// just array of objects with ordered index field and filtering utilities
var Seq = {
  instance: function(opts, indexField) {
    return Object.create(Seq).init(opts, indexField);
  },

  init: function(opts, indexField) {
    if (typeof opts === 'string') {
      opts = { index: opts };
    } else if (Array.isArray(opts)) {
      opts = { items: opts, index: indexField }
    } else {
      opts = opts || {};
    }

    var indexField = this.indexField = opts.index || 'ts';
    this.sorter = function(a, b) {
      return a[indexField] >= b[indexField];
    };
    this.reset(opts.items);
    return this;
  },

  reset: function(items) {
    this.items = Array.isArray(items) ? items.slice() : [];
    if (this.items.length > 0) this.items.sort(this.sorter);
  },

  firstIndex: function(ts) {
    var i = bsearch(this.items, ts, this.indexField);
    return i < this.items.length ? i : -1;
  },
  first: function(ts) {
    var i = this.firstIndex(ts);
    if (i >= 0) return this.items[i];
  },
  afterIndex: function(ts) {
    return bsearch.upperBound(this.items, ts, this.indexField);
  },

  size: function() {
    return this.items.length;
  },
  last: function() {
    if (this.items.length > 0) return this.items[this.items.length-1];
  },
  update: function(ts, data) {
    var item = this.first(ts);
    if (item) assignExcept(item, data, this.indexField);
  },
  add: function(item) {
    var key = this.indexField;
    this.items.push(item);

    var last = this.last();
    if (last && item[key] < last[key]) {
      this.items.sort(this.sorter);
    }
    return this;
  },

  filter: function(opts) {
    if (!opts) return this.items;

    var fn = typeof opts === 'function' ? opts : matcher(opts);
    return this.items.filter(fn);
  },
};

module.exports = Seq;
