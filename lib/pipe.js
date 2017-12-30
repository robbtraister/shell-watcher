'use strict'

const childProcess = require('child_process')

const shared = require('./shared')

let debug = console.log
try {
  debug = require('debug')('watcher:pipe')
} catch (e) {}

function pipe (options) {
  options = shared.defaults(options)
  const handler = options.handler || shared.invalidater(options.targets)
  const onchange = options.onchange

  const watch = childProcess.spawn(`${__dirname}/../watch.sh`, options.targets, {
    env: {
      // NOTIFY: 'echo',
      EXTS: options.exts,
      SLEEP: options.sleep
    }
  })

  watch.stdout.on('data', (str) => {
    const data = shared.parse(str.toString())
    handler(data)
    onchange && onchange(data)
  })

  debug(`Listening for cache reload`)
}

module.exports = pipe
