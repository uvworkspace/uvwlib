'use strict'

var NamedList = require('../lib/named-list');
var Plug = require('./plug')

var XbarMixin = {
  isFused: function () {
    return !!this._fused;
  },

  join: function (app, spec) {
    this.plugIn(Plug.instance(app, spec || app.SPEC))
  },

  plugs: function() {
    return this._plugs || (this._plugs = NamedList.instance({ key: 'name', nullKey: true }));
  },

  plugIn: function (plug) {
    if (this.plugs().has(plug)) return;

    plug.setContext(this)
    this.plugs().add(plug)

    if (this._fused) this._insertPlug(plug)
  },

  closestPlugs: function (spec, appType) {
    var plugs = this.plugs().filter(function (p) {
      return p.forType !== 'none' && p.appType === spec.need
    })

    if (plugs.length && appType) {
      var specifics = plugs.filter(function (p) {
        return p.forType === appType
      })
      plugs = specifics.length ? specifics : plugs.filter(function (p) { return !p.forType })
    }

    return plugs.length ? plugs : (this.parent && this.parent.closestPlugs(spec, appType))
  },

  fuse: function () {
    if (!this._fused) this._fuse(false)
  },

  _fuse: function (secondPass) {
    if (!secondPass) {
      this.plugs().items.forEach(function (plug) {
        plug.fusing()
      })
      this.eachChild(function (child) {
        child.fuse()
      });
      if (!this.parent) this._fuse(true) // second pass
    } else {
      this._fused = true
      this.plugs().items.forEach(function (plug) {
        plug.fused();
      });
      this.eachChild(function (child) {
        child._fuse(true);
      });
    }
  },

  push: function (token, fromCntx) {
    this.plugs().items.forEach(function (plug) {
      plug.onToken(token);
    });
    this.eachChild(function (child) {
      if (child !== fromCntx) child.push(token, this);
    });
    if (this.parent && this.parent !== fromCntx) {
      this.parent.push(token, this);
    }
  },

  _insertPlug: function (newPlug, fromCntx) {
    this.plugs().items.forEach(function (plug) {
      if (plug !== newPlug) plug.onNewPlug(newPlug);
    })

    this.eachChild(function (child) {
      if (child !== fromCntx) child._insertPlug(newPlug, this);
    })
    if (this.parent && this.parent !== fromCntx) {
      this.parent._insertPlug(newPlug, this);
    }
  }
};

module.exports = XbarMixin;
