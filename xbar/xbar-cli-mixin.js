'use strict';

function xbars(index) {
  return index.cntx.service('xbar');
}

// This is for index, not context
var XbarCliMixin = {
  xbar_info: function () {
    console.log(xbars(this).db.info());
  },

  xbar_login: function(args, opts) {
    return xbars(this).login(args[0] || opts.uid, !!opts.local);
  },

  xbar_logout: function(args, opts) {
    return xbars(this).logout(!!opts.local);
  },


  xbar_create_session: function (args, opts) {
    var sid = args[0] || opts.sid;
    if (!sid) return 'missing sid'; 

    return xbars(this).createSession(sid);
  },


  xbar_mbox: function () {
    console.log(xbars(this).getSession());
  },

  xbar_join_session: function (args, opts) {
    var sid = args[0] || opts.sid;
    if (!sid) return 'missing sid'; 

    return xbars(this).joinSession(sid);
  },

  xbar_enter_session: function (args, opts) {
    var sid = args[0] || opts.sid;
    if (!sid) return 'missing sid'; 

    return xbars(this).enterSession(sid);
  },

  xbar_next: function(args, opts) {
    return xbars(this).next(function(msg) {
      console.log('xbar_next got:', msg);
    });
  },

  xbar_cli: function(args, opts) {
    return this.cntx.emitChannel('xbar', 'command', {
      path: [], 
      cmd: args[0], 
      args: args.slice(1),
      opts: opts
    });
  },

  /*
  xbar_start_ws: function() {
    xbars(this).xbarWs.start();
  },
  xbar_stop_ws: function() {
    xbars(this).xbarWs.stop();
  },
  xbar_join_ws: function() {
    xbars(this).xbarWs.join();
  },
  xbar_leave_ws: function() {
    xbars(this).xbarWs.leave();
  },
  */
};

module.exports = XbarCliMixin;
