'use strict';

var XbarCliMixin = require('../xbar/xbar-cli-mixin');
var nodeUtils = require('../node/utils');
var SimpleCli = require('./simple-cli');

var DiskMeta = SimpleCli.subclass(XbarCliMixin, {
  init: function(cntx) {
    SimpleCli.init.call(this, cntx);
  },
 
  cd: function(name) {
    var child = this.cntx.child(name);
    if (!child) {
      var spec = this.factory().childSpec(this.cntx, name);
      if (spec) child = this.cntx.addChild(name, spec);
    }
    return child;
  },

  cli_info: function() {
    console.log('Hello, disk');
  },

  cli_push: function(args, opts) {
    var sess = this.xbarc().getSession(opts.sid);
    if (!sess) return console.error('no session');

    var fpath = this.cntx.filePath(args[0]);
    console.log(nodeUtils.isFile(fpath), fpath);
    var s = nodeUtils.readFile(fpath);
    console.log('FILE size', s.length);

    this.cntx.emitChannel('xbar', 'meta', {
      what: 'file',
      data: s
    });
  },

  cli_msg: function(args, opts) {
    var sess = this.xbarc().getSession(opts.sid);
    if (!sess) return console.error('no session');

    return this.cntx.emitChannel('xbar', 'message', {
      args: args,
      opts: opts,
    });
  },
});

module.exports = DiskMeta;
