'use strict';

var frontMatter = require('./front-matter');

var FrontWrapper = {
  yamlParser: frontMatter.yamlParser,

  instance: function(front) {
    return Object.create(FrontWrapper).init(front);
  },

  init: function(front) {
    this.front = typeof front === 'string' ? frontMatter(front) : front;
    return this;
  },

  data: function(idx) {
    idx = idx || 0;
    return this.front[idx].data || (this.front[idx].data = {}); 
  },
  texts: function(idx) {
    idx = idx || 0;
    return this.front[idx].texts || (this.front[idx].texts = []); 
  },
  text: function(idx, idx2) {
    return this.texts(idx)[idx2 || 0] || '';
  },

  attr: function(idx, name, val) {
    var data = this.data(idx);
    if (arguments.length < 3) return data[name];

    data[name] = val;
  },

  pushAttr: function(idx, name, val) {
    var data = this.data(idx);
    if (!data[name]) data[name] = [];
    data[name].push(val);
  },

  section: function(idx) {
    return typeof idx === 'string' ? this.front.find(function(sec) {
      return sec.name === idx;
    }) : this.front[idx || 0];
  },

  toText: function() {
    return frontMatter.toText(this.front);
  },
}

module.exports = FrontWrapper;
