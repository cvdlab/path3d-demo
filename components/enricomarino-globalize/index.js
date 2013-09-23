/**
 * globalize
 * globalize component
 * 
 * @copyright 2013 Enrico Marino
 * @license MIT
 */

/**
 * Expose `gloabalize`
 */

module.exports = globalize;

/**
 * global
 */

var global = window || exports; 

/** 
 * globalize
 * globalize the properties of `obj`
 * 
 * @param {Object} obj properties to globalize
 * @api public
 */

function globalize (obj) {
  for (var property in obj) {
    global[property] = obj[property]
  }
}
