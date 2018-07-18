const puppeteer = require('puppeteer')
const url = 'https://movie.douban.com/explore#!type=movie&tag=%E7%83%AD%E9%97%A8&sort=recommend&page_limit=20&page_start=20'
const sleep = time => new Promise(resolve => [
  setTimeout(resolve, time)
])

;(async () => {
  console.log('Start visit the target page')
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'networkidle'
  })
  await sleep(3000)
  await page.awaitForSelector('.more')
  for (let i = 0; i < 1; i++) {
    await sleep(3000)
    await page.click('.more')
  }
  const result = await page.evaluate(() => {

  })
})()
