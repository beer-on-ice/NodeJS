// 根据豆瓣电影id拿电影封面图，id，视频-子进程
const cp = require('child_process')
const {resolve} = require('path')

;(async () => {
  const script = resolve(__dirname, '../crawler/video')
  const child = cp.fork(script, [])
  let invoked = false

  child.on('err', err => {
    if (invoked) return
    invoked = true
    console.log(err)
  })

  child.on('exit', code => {
    if (invoked) return
    invoked = true
    let err = code === 0 ? null : new Error('exit code ' + code)
    console.log(err)
  })

  child.on('message', data => {
    console.log(data)
  })
})()
