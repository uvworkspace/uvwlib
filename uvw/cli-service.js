'use strict';

var utils = require('../lib/utils');
var simpleDispatch = require('../xbar/simple-dispatch');

// For now, some service subscriptions are based on convention
// some actively register with root or cur contexts

var CliService = utils.class({
  init: function(name, rootCntx) {
    this.name = name;
    this.rootCntx = rootCntx;
  },

  execute: function(req) {
    var cntx = this.rootCntx;
    var ret = cntx.followPath(req.path);
    if (ret.tail.length) {
      return 'unknown ' + cntx.path.join('/')
           + '/' + req.cmd + ' ' + ret.tail.join('/');  
    }

    var index = ret.context.index();
    return simpleDispatch(cntx.index(), req.cmd, req.args, req.opts);   
  },
});

module.exports = CliService;
