'use strict';
/* global alert */
/* eslint-disable no-eval */

var _ = require('lodash');
var $ = require('jquery');
var ko = require('knockout');
var Emitter = require('component-emitter');

var utils = require('../lib/utils');

var Komp = utils.inherit(Emitter, {

  setTurbolinks: function (tbl) {
    Komp.Turbolinks = tbl;
  },

  visit: function (url, opts) {
    if (Komp.Turbolinks) {
      if (url && typeof url === 'object') {
        opts = url;
        url = null;
      }
      if (url && typeof url === 'string') {
        Komp.Turbolinks.visit(url, opts);
      } else {
        url = window.location.pathname;
        Komp.Turbolinks.visit(url, opts || { replace: true });
      }
    } else if (typeof url === 'string') {
      window.location = url;
    } else {
      window.location.reload();
    }
  },

  replaceWithTurbolinks: function (html) {
    if (Komp.Turbolinks && html) {
      var s = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1];
      document.body.innerHTML = s;
      Komp.Turbolinks.dispatch('turbolinks:load');
      var arr = document.body.getElementsByTagName('script');
      for (var i = 0; i < arr.length; i++) {
        eval(arr[i].innerHTML);
      }
    }
  },

  // ko utils here for now
  setErrors: function (vm, errors) {
    var alerts = [];
    _.each(errors, function (err, key) { // for both error map and array
      if (typeof key === 'number') {
        key = err && (err.property || err.name || err.clientPath || err.path);
        err = err && err.message;
      }

      var ob = err && key && vm[key];
      if (ob && ob.setError && ob.isModified) {
        ob.setError(err);
        ob.isModified(true);
      } else {
        alerts.push(key + ' ' + err);
      }
    });
    if (alerts.length) alert(alerts.join('\n'));
  },

  showErrors: function (json, vm) {
    if (!json) return;

    if (vm && json.errors) {
      Komp.setErrors(vm, json.errors);
    } else if (json.status && json.statusText) {
      alert('Error ' + json.status + ': ' + json.statusText);
    } else {
      console.error(json.errors || json.message || json.error || json);
    }
  },

  postPjax: function (q, vm, hdl, opts) {
    return q.done(function (ret) {
      if (ret && ret.errors) {
        Komp.showErrors(ret, vm);
        return false;
      } else if (hdl) {
        if (typeof hdl === 'function') {
          hdl();
        } else {
          Komp.visit(hdl, opts);
        }
        return true;
      }
    }).fail(function (err) {
      Komp.showErrors(err, vm);
    });
  },

  validateExtendOptions: function (exts) {
    var opts = {};
    if (exts) {
      Object.keys(exts).forEach(function (key) {
        opts[key] = {
          create: function (opt) {
            return ko.observable(opt.data).extend(exts[key]);
          }
        };
      });
    }
    return opts;
  },

  isJQuery: function (data) {
    return !!(data && data.jquery);
  },

  register: function (name, comp) {
    if (name && comp && !ko.components.isRegistered(name)) {
      ko.components.register(name, comp);
    }
  },

  TagName: function (comp) {
    var nm = comp && comp.elem && comp.elem.nodeName;
    return typeof nm === 'string' ? nm.toLowerCase() : '';
  },

  viewModelFactory: function (Cls) {
    return {
      createViewModel: function (params, compInfo) {
        return Object.create(Cls).init(params, compInfo.element);
      }
    };
  },

  // instance

  init: function (params, elem) {
    var cntx = params.cntx;
    if (typeof cntx === 'string') cntx = ko.contextFor(elem)[cntx];

    this.cntx = cntx;
    if (!cntx) {
      var c = ko.contextFor(elem);
      this.cntx = (c && (c.$component || c.$root)) || {};
    }
    this.elem = elem;
    this.hideClass = null;
    return this;
  },

  tagName: function () {
    return Komp.TagName(this);
  },

  cntxEmit: function () {
    if (typeof this.cntx.emit === 'function') {
      this.cntx.emit.apply(this.cntx, arguments);
    }
  },

  cancel: function () {
    this.cntxEmit('cancel', this);
  },
  done: function () {
    this.cntxEmit('done', this);
  },

  showCardBefore: function (comp, params, target, id) {
    this.showCard(comp, params, target, id, true);
  },
  showCardAfter: function (comp, params, target, id) {
    this.showCard(comp, params, target, id, true, true);
  },

  showCard: function (comp, params, target, id, noHide, after) {
    if (!comp || !target) return;

    var $target = Komp.isJQuery(target) ? target : $(target);
    if (!$target[0]) return;

    if (!noHide) {
      if (this.hideClass) $target.addClass(this.hideClass);
      else $target.hide();
    }

    var cards = this._cards || (this._cards = {});
    var cardId = id || target.toString();
    var card = cards[cardId];
    if (card) {
      card.$comp.show();
    } else {
      params = params ? ' params="' + params + '"' : '';
      var $comp = $('<' + comp + params + '></' + comp + '>');
      $comp.data('card-id', cardId);
      card = cards[cardId] = {
        id: cardId,
        type: comp,
        $comp: $comp,
        hiding: noHide ? null : target
      };
      ko.applyBindings(this, $comp[0]);
      if (after) {
        $comp.insertAfter($target[0]);
      } else {
        $comp.insertBefore($target[0]);
      }
    }
    return cardId;
  },

  appendCard: function (comp, params, target, id) {
    if (!comp || !target) return;

    var $target = Komp.isJQuery(target) ? target : $(target);
    if (!$target[0]) return;

    var cards = this._cards || (this._cards = {});
    var cardId = id || target.toString();
    var card = cards[cardId];
    if (card) {
      card.$comp.show();
    } else {
      params = params ? ' params="' + params + '"' : '';
      var $comp = $('<' + comp + params + '></' + comp + '>');
      $comp.data('card-id', cardId);
      card = cards[cardId] = {
        id: cardId,
        type: comp,
        $comp: $comp,
        hiding: null
      };
      ko.applyBindings(this, $comp[0]);
      $comp.appendTo($target[0]);
    }
  },

  hideCard: function (cardId) {
    if (typeof cardId !== 'string') {
      cardId = cardId.elem && $(cardId.elem).data('card-id');
    }
    if (!cardId) return;

    var card = this._cards && this._cards[cardId];
    if (card) {
      card.$comp.hide();
      if (card.hiding) {
        if (this.hideClass) $(card.hiding).removeClass(this.hideClass);
        else $(card.hiding).show();
      }
    }
  },

  resetCards: function () {
    _.each(this._cards, function (card) {
      if (card.$comp) card.$comp.remove();
    });
    this._cards = null;
  },

  clearCard: function (id) {
    if (id && this._cards) {
      var card = this._cards[id];
      if (card && card.$comp) card.$comp.remove();
      delete this._cards[id];
    }
  },

  finder: function () {
    return this.$finder || (this.$finder = $(this.elem || 'body'));
  },

  find: function (sel) {
    return this.finder().find(sel);
  },

  closest: function (evt, sel) {
    return $(evt.target).closest(sel);
  },

  closestData: function (evt, name) {
    if (evt && evt.target && name) {
      var field = 'data-' + name;
      return $(evt.target).closest('[' + field + ']').attr(field);
    }
  }
});

module.exports = Komp;
