const fs = require('fs')
const puppeteer = require('puppeteer')
const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
  const browser = await puppeteer.launch({
    headless: false
  })
  const page = await browser.newPage()
  await page.goto('https://y.qq.com/n/yqq/playlist/2137413180.html#stat=y_new.profile.create_playlist.click&dirid=3')
  sleep(2000)
  let songs = await page.evaluate(() => {
    let songList = [...document.querySelectorAll('span.songlist__songname_txt a')]
    return songList.map(a => {
      return {
        name: a.innerText
      }
    })
  })
  await page.screenshot({
    path: './puppeteer/qqmusic/qq.png',
    type: 'png',
    fullPage: true
  })
  let writeStream = fs.createWriteStream('./puppeteer/qqmusic/歌词.txt')
  for (let i = 1; i < songs.length; i++) {
    writeStream.write(songs[i].name, 'UTF8')
  }
  writeStream.end()

  browser.close()
})()
