// 抓取豆瓣电影列表数据
const puppeteer = require('puppeteer')
const url = 'https://movie.douban.com/tag/#/?sort=R&range=6,10&tags='
// 暂停
const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
  console.log('Start visit the target page')
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false,
    headless: false
  })
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'networkidle2' //  满足什么条件认为页面跳转完成,只有2个网络连接时触发（至少500毫秒后）
  })
  await sleep(3000)
  await page.waitForSelector('.more') // 等待指定的选择器匹配的元素出现在页面中
  for (let i = 0; i < 1; i++) {
    await sleep(3000)
    await page.click('.more')
  }
  const result = await page.evaluate(() => {
    let $ = window.$
    let items = $('.list-wp a')
    let links = []
    if (items.length >= 1) {
      items.each((index, item) => {
        let it = $(item)
        let doubanId = it.find('div').data('id')
        let title = it.find('.title').text()
        let rate = Number(it.find('.rate').text())
        let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')
        links.push({
          doubanId,
          title,
          rate,
          poster
        })
      })
    }
    return links
  })
  browser.close()

  process.send({result})
  process.exit(0)
})()
