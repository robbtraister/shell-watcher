# shell-watcher

This package performs file watching using basic shell commands.  You can use the `watch.sh` script directly, or the exported node functions from `index.js`.

## Implementation

There are 2 versions: `http` and `pipe`.  The `pipe` version is simpler, likely more efficient, and has no external dependencies.  However, the `http` version can be manually triggered with a simple `curl` command if you want to do something out-of-process.

## Usage

```sh
EXTS=js,json NOTIFY=echo SLEEP=3 ./watch.sh ./some/dir ./some/other
```

```json
var watch = require('shell-watcher');
watch({
  targets: ['./some/dir',  './some/other'],
  exts: ['js', 'json'],
  sleep: 2
  })
```

```json
var watch = require('shell-watcher');
watch.pipe({
  targets: './some/dir',
  exts: 'js',
  sleep: 2
  })
```

```json
var watch = require('shell-watcher');
watch.http({
  targets: ['./some/dir',  './some/other'],
  exts: 'js',
  sleep: 2,
  port: 9001
  })
```
