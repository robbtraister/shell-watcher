var path = require('path');

var debug = console.log;
try {
  debug = require('debug')('reload:shared');
} catch(e) {}


var invalidater = module.exports.invalidater = function invalidater(targets) {
  // ensure trailing slashes;
  targets = targets.map(t => t.replace(/\/*$/, '/'));

  return function invalidate(data) {
    // invalidate only the files that have changed
    // this only works if all files are `require`d on-demand
    /*
    data
      .split('\n')
      .filter(p => !!p)
      .map(p => path.resolve(p))
      .forEach(p => delete require.cache[p])
    */

    // invalidate all files in the target directories
    Object.keys(require.cache)
      .forEach(p => {
        if (targets.find(t => p.startsWith(t))) {
          delete require.cache[p];
        }
      })

    debug('Cache Invalidated');
  }
};


var defaults = module.exports.defaults = function defaults(options) {
  options = options || {};

  var targets = options.targets || options.target || `${__dirname}/../app`;
  options.targets = (targets instanceof Array ? targets : [targets])
    .map(p => path.resolve(p));

  return options;
};
