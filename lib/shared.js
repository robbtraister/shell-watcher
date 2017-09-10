'use strict'

const path = require('path')

let debug = console.log
try {
  debug = require('debug')('watcher:shared')
} catch (e) {}

function invalidater (targets) {
  // ensure trailing slashes;
  targets = targets.map(t => t.replace(/\/*$/, '/'))

  return function invalidate (data) {
    // invalidate only the files that have changed
    // this only works if all files are `require`d on-demand
    /*
    data.forEach(p => delete require.cache[p])
    */

    // invalidate all files in the target directories
    Object.keys(require.cache)
      .filter(p => targets.find(t => p.startsWith(t)))
      .forEach(p => { delete require.cache[p] })

    debug('Cache Invalidated')
  }
}

function parse (data) {
  return data
    .split('\n')
    .filter(p => !!p)
    .map(p => path.resolve(p))
}

function defaults (options) {
  options = options || {}

  const targets = Array.prototype.concat(options.targets, options.target)
    .filter(t => !!t)

  if (!targets.length) {
    throw new Error('`target` or `targets` is required')
  }
  options.targets = targets.map(p => path.resolve(p))

  options.exts = options.exts || 'js'
  options.sleep = options.sleep || 1

  return options
}

module.exports = {
  invalidater,
  parse,
  defaults
}
