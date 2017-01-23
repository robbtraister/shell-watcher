var child_process = require('child_process');

var shared = require('./shared');

var debug = console.log;
try {
  debug = require('debug')('reload:pipe');
} catch(e) {}


var pipe = module.exports = function pipe(options) {
  options = shared.defaults(options);

  var watch = child_process.spawn(`${__dirname}/../watch.sh`, options.targets, {
    env: {
      // NOTIFY: 'echo',
      EXTS: options.exts || 'js',
      SLEEP: options.sleep || 1
    }
  });

  watch.stdout.on('data', (data) => {
    shared.invalidate(data.toString(), options);
  });

  debug(`Listening for cache reload`);
};


module.exports = pipe;
