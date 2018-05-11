'use strict'

var utils = require('../lib/utils')
var NamedList = require('../lib/named-list');

// Context - providing structural place holder
//   - with spec (syntactical object, JSON)
//   - service: object providing specific service (via composition), sync or promise api
//     to be used in clear application logic flow
//   - channel: event-based, for objects to notify each other
//   - mixin: augument context behaver (including root)
//     . use mixins only for mixing same behaviors in different classes
var Context = utils.class({
  init: function (parent, name, spec) {
    spec = spec || {};
    utils.assert(!parent || parent.root, 'parent missing root');

    this.parent = parent || null
    this.root = parent ? parent.root : this;
    this.name = name;
    this.spec = spec;

    this._cntxs = NamedList.instance({ key: 'name', nullKey: true });

    if (!parent) {
      this._services = NamedList.instance({ key: 'name', nullKey: false });
      this._channels = NamedList.instance({ key: 'name', nullKey: false });
      this._mixins = NamedList.instance({ key: 'name', nullKey: true });
    }

    return this;
  },

  isRoot: function() {
    return !this.parent;
  },

  service: function(name) {
    return this.root._services.get(name);
  },
  addService: function(service) {
    return this.root._services.add(service);
  },
  channel: function(name) {
    return this.root._channels.get(name);
  },
  addChannel: function(channel) {
    return this.root._channels.add(channel);
  },
  addMixin: function(mixin) {
    utils.assignSafe(this.root, mixin);
    this.root._mixins.add(mixin);
  },

  children: function() {
    return this._cntxs.items;
  },

  child: function(name) {
    return this._cntxs.get(name);
  },

  childAt: function(idx) {
    return this._cntxs.items[idx];
  },

  eachChild: function(fn, me) {
    this._cntxs.each(fn, me);
  },

  lookup: function(name) {
    var val = this[name];
    return val === undefined && this.parent ? this.parent.lookup(name) : val;
  },

  _applyMixins: function(cntx) {
    this.root._mixins.each(function(mixin) {
      utils.assignSafe(cntx, mixin);
    });
  },
  _newChild: function(name, spec) {
    var ch = Context.instance(this, name, spec);
    this._applyMixins(ch, true);
    return ch;
  },

  addChild: function(name, spec) {
    utils.assert(!name || !this.child(name), 'child exists');

    return this._cntxs.add(this._newChild(name, spec));
  },
});

module.exports = Context;
