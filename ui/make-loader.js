'use strict';

var assetLoader = require('./asset-loader');

module.exports = function (fn) {
  // fn expected to accept arguments and return:
  // {
  //   url: asset url or url array
  //   varName: if given, global var name after assets loaded
  //   args: additional arguments passed to loader
  // }
  // the assetLoader.loadAsset(s) is expected to resolve to a function
  return function () {
    var args1 = arguments;
    return { load: function () {
      var args2 = arguments;
      return fn.apply(null, args1).then(function (opts) {
        var q = Array.isArray(opts.url)
          ? assetLoader.loadAssets(opts.url, opts.varName)
          : assetLoader.loadAsset(opts.url, opts.varName);
        return q.then(function (loader) {
          if (Array.isArray(opts.args) && opts.args.length) {
            args2 = Array.prototype.slice.call(args2).concat(opts.args);
          }
          return loader.apply(null, args2);
        });
      });
    }};
  };
};
