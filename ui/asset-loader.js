'use strict';
/* global document, window */

function loadAsset (asset, varName) {
  if (varName && typeof window[varName] !== 'undefined') {
    return Promise.resolve(window[varName]);
  }

  if (typeof asset === 'string') {
    if (/\.css$/.test(asset)) {
      asset = { src: asset, type: 'css' };
    } else {
      asset = { src: asset };
    }
  }

  var tag;
  if (asset.type === 'css') {
    tag = document.createElement('link');
    tag.setAttribute('rel', 'stylesheet');
    tag.setAttribute('href', asset.src);
  } else {
    tag = document.createElement('script');
    tag.setAttribute('type', 'text/javascript');
    tag.setAttribute('src', asset.src);
  }

  return new Promise(function (resolve) {
    tag.async = true;
    tag.onreadystatechange = tag.onload = function () {
      var state = tag.readyState;
      if (!state || /loaded|complete/.test(state)) {
        resolve(varName ? window[varName] : undefined);
      }
    };
    document.getElementsByTagName('head')[0].appendChild(tag);
  });
}

function loadAssets (assets, varName) {
  if (varName && typeof window[varName] !== 'undefined') {
    return Promise.resolve(window[varName]);
  }

  function loadIt (previous, assets, i) {
    return previous.then(function () {
      return loadAsset(assets[i]);
    });
  }

  var previous = Promise.resolve();
  for (var i = 0; i < assets.length; i++) {
    previous = loadIt(previous, assets, i);
  }

  return !varName ? previous : previous.then(function () {
    return window[varName];
  });
}

exports.loadAsset = loadAsset;
exports.loadAssets = loadAssets;
