var child_process = require('child_process');

var shared = require('./shared');

var debug = console.log;
try {
  debug = require('debug')('reload:pipe');
} catch(e) {}


var pipe = module.exports = function pipe(options) {
  options = shared.defaults(options);
  var handler = options.handler || shared.invalidater(options.targets);

  var watch = child_process.spawn(`${__dirname}/../watch.sh`, options.targets, {
    env: {
      // NOTIFY: 'echo',
      EXTS: options.exts || 'js',
      SLEEP: options.sleep || 1
    }
  });

  watch.stdout.on('data', (data) => {
    handler(data.toString());
  });

  debug(`Listening for cache reload`);
};


module.exports = pipe;