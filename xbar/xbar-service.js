'use strict';

var uvwlib = require('uvwlib');

var XbarService = uvwlib.class({
  init: function(name, rootCntx, xbarDb) {
    uvwlib.assert(name && rootCntx && xbarDb, 'invalid input');

    this.name = name;
    this.rootCntx = rootCntx;
    this.hashId = rootCntx.hashId();
    this.db = xbarDb;
    this.xbarc = xbarDb.connect(this.hashId);
  },

  getUser: function() {
    return this.xbarc.getUser();
    // { uid: xxx } - via home
    // { uid: xxx, hashId: yyy } - per site
  },

  //TODO: fix login logout
  login: function(uid, isLocal) {
    if (!uid) return console.log(this.getUser());

    return this.xbarc.saveUser({
      uid: uid,
      hashId: isLocal ? this.hashId : null,
    });
  },

  logout: function(isLocal) {
    return this.xbarc.saveUser({
      hashId: isLocal ? this.hashId : null
    });
    return console.log(this.getUser());
  },

  createSession: function(sid) {
    return this.xbarc.createSession(sid, {
      baseDir: this.rootCntx.baseDir,
    });
  },

  joinSession: function(sid) {
    return this.xbarc.joinSession(sid);
  },

  leaveSession: function(sid) {
    return this.xbarc.leaveSession(sid);
  },

  enterSession: function(sid) {
    return this.xbarc.enterSession(sid);
  },

  getSession: function(sid) {
    return this.xbarc.getSession(sid);
  },

  //TODO: fix me
  next: function(sid, fn) {
    if (typeof sid === 'function') {
      fn = sid;
      sid = null;
    }
    return this.xbarc.next(sid, fn); 
  },

  handleEvent: function(event, req) {
    var sid = req.sid || null;
    if (event === 'message') {
      return this.db.pushMessage(sid, this.hashId, req);
    }
    if (event === 'command') {
      return this.db.executeCommand(sid, this.hashId, req);
    }
  },
});

module.exports = XbarService;
