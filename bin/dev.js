#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const log = console.log.bind(console, '>>> [DEV]:'.red)
const projectRootPath = path.resolve(__dirname, '..')
const appPath = path.join(projectRootPath, 'src')

const chokidar = require('chokidar')
const watcher = chokidar.watch(path.join(__dirname, '../src'))
watcher.on('ready', function () {
  require('../src/index')
  log('服务已启动'.green)

  watcher
    .on('add', function (absPath) {
      cacheClean()
    })
    .on('change', function (absPath) {
      cacheClean()
    })
    .on('unlink', function (absPath) {
      let rmfile = path.join(appPath, absPath)
      try {
        fs.unlinkSync(rmfile)
      } catch (e) {
        console.log(e)
        return
      }
      console.log('Deleted', rmfile)
      cacheClean()
    })
})

function cacheClean () {
  Object.keys(require.cache).forEach(function (id) {
    if (/[\/\\](src)[\/\\]/.test(id)) {
      delete require.cache[id]
    }
  })
  log('清理缓存完成...'.green)
}

process.on('exit', function (e) {
  log('Server quit'.green)
})
