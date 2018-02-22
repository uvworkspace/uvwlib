'use strict';

var assetLoader = require('./asset-loader');

function simpleLoader(assetMap) {
  function loadjs(name) {
    var idx = name.indexOf(':');
    var assetKey = idx > 0 ? name.slice(0, idx) : name;
    var action = idx > 0 ? name.slice(idx + 1) : null;

    var entry = assetMap[assetKey];
    if (!entry) return Promise.reject('assets ' + assetKey + ' not found');

    var varName = entry.varName || assetKey;
    var args = Array.prototype.slice.call(arguments, 1);
    var resolved = typeof entry.resolved !== 'undefined';
    var q = resolved ? Promise.resolve(entry.resolved) : (
      Array.isArray(entry.url) ? assetLoader.loadAssets(entry.url, varName) :
      assetLoader.loadAsset(entry.url, varName));
    return q.then(function (obj) {
      entry.resolved = obj || null;

      if (!action && args.length === 0) return obj; 

      var fn = action ? obj[action] : obj;
      if (typeof fn !== 'function') {
        return Promise.reject((action || assetKey) + ' not a function');
      }

      return fn.apply(null, args);
    });
  }
  loadjs.assets = assetMap;

  return loadjs;
}

module.exports = simpleLoader;

