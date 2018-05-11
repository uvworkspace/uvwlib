'use strict';

var defaults = require('../lib/utils/defaults');
var SimpleCli = require('./simple-cli');

var NilMeta = SimpleCli.subclass({
  cd: function(name) {
    var child = this.cntx.child(name);
    if (!child) {
      var spec = this.cntx.factory().childSpec(this.cntx, name);
      if (spec) child = this.cntx.addChild(name, spec);
    }
    return child;
  },

  cli_info: function() {
    console.log('Hello, nil');
  },
});

module.exports = NilMeta;
