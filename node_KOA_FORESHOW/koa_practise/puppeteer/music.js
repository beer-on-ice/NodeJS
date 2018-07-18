const fs = require('fs')
const puppeteer = require('puppeteer')

;(async () => {
  const browser = await (puppeteer.launch({
    headless: false
  }))
  const page = await browser.newPage()
  // 进入页面
  await page.goto('https://music.163.com/#')
  const musicName = '西海情歌'
  // page.type 获取输入框焦点并输入文字
  await page.type('.txt.j-flag', musicName, {delay: 0}) // 搜索

  // page.keyboard.press 模拟键盘按下某个按键，目前mac上组合键无效为已知bug
  await page.keyboard.press('Enter') // 回车

  // page.waitFor 页面等待，可以是时间、某个元素、某个函数
  await page.waitFor(2000)// 获取歌曲列表的 iframe
  // page.frames() 获取当前页面所有的 iframe，然后根据 iframe 的名字精确获取某个想要的 iframe
  let iframe = await page.frames().find(f => f.name() === 'contentFrame')
  // iframe.$('.srchsongst') 获取 iframe 中的某个元素
  const SONG_LS_SELECTOR = await iframe.$('.srchsongst')

  // 获取歌曲 西海情歌 的地址
  // iframe.evaluate() 在浏览器中执行函数，相当于在控制台中执行函数，返回一个 Promise
  const selectedSongHref = await iframe.evaluate(e => {
    const idx = songList.findIndex(v => v.childNodes[1].innerText.replace(/\s/g, '') === '西海情歌')
    return songList[idx].childNodes[1].firstChild.firstChild.firstChild.href
  }, SONG_LS_SELECTOR)

  // 进入歌曲页面
  await page.goto(selectedSongHref)

  // 获取歌曲页面嵌套的iframe
  await page.waitFor(2000)
  iframe = await page.frames().find(f => f.name() === 'contentFrame')

  // 点击展开按钮(歌词展开按钮)
  const unfoldButton = await iframe.$('#flag_ctrl')
  await unfoldButton.click()

  // 获取歌词
  const LYRIC_SELECTOR = await iframe.$('#lyric-content')
  const lyricCtn = await iframe.evaluate(e => {
    return e.innerText
  }, LYRIC_SELECTOR)

  // 截图
  await page.screenshot({
    path: './歌曲.png',
    fullPage: true
  })

  // 写入歌词
  let writeStream = fs.createWriteStream('歌词.txt')
  writeStream.write(lyricCtn, 'UTF8')
  writeStream.end()

  // 获取评论数量
  // iframe.$eval() 相当于在 iframe 中运行 document.queryselector 获取指定元素，并将其作为第一个参数传递
  const commentCount = await iframe.$eval('.sub.s-fc3', e => e.innerText)

  // 获取评论
  // iframe.$$eval 相当于在 iframe 中运行 document.querySelectorAll 获取指定元素数组，并将其作为第一个参数传递
  const commentList = await iframe.$$eval('.itm', elements => {
    const ctn = elements.map(v => {
      return v.innerText.replace(/\s/g, '')
    })
    return ctn
  })
})()
