'use strict';

var path = require('path');
var utils = require('../lib/utils');

var SimpleCli = utils.class({
  init: function(cntx) {
    this.cntx = cntx;
    return this;
  },

  xbarc: function() {
    return this.cntx.channel('xbar');
  },

  parentIndex: function() {
    return this.cntx.parent && this.cntx.parent.index();
  },
});

module.exports = SimpleCli;
