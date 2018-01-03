'use strict'

var slice = Array.prototype.slice

var ui = {
  // REF: https://github.com/nefe/You-Dont-Need-jQuery
  ready: function (fn) {
    if (document.readyState === 'complete' || document.readyState !== 'loading') {
      fn()
    } else {
      document.addEventListener('DOMContentLoaded', fn)
    }
  },

  // REF: http://ryanmorr.com/abstract-away-the-performance-faults-of-queryselectorall/
  find: function (elem, selector) {
    if (arguments.length < 2) {
      selector = elem
      elem = document
    } else {
      elem = typeof elem === 'string' ? ui.find(elem)[0] : (elem || document)
      if (!elem) return []
    }

    if (/^(#?[\w-]+|\.[\w-.]+)$/.test(selector)) {
      switch (selector.charAt(0)) {
        case '#':
          var found = document.getElementById(selector.substr(1))
          return found ? [found] : []
        case '.':
          var classes = selector.substr(1).replace(/\./g, ' ')
          return slice.call(elem.getElementsByClassName(classes))
        default:
          return slice.call(elem.getElementsByTagName(selector))
      }
    }

    return slice.call(elem.querySelectorAll(selector))
  }
}

module.exports = ui
