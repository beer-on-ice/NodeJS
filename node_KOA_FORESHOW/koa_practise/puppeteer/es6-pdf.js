const puppeteer = require('puppeteer')
const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

// puppeteer的launch方法生成了一个browser的实例，对应于浏览器
puppeteer.launch()
  .then(async browser => {
  // browser.newPage方法可以打开一个新选项卡并返回选项卡的实例page，通过page上的各种方法可以对页面进行常用操作
    let page = await browser.newPage()
    await page.goto('http://es6.ruanyifeng.com/#README')
    await sleep(3000)
    // page.evaluate(pageFunction, ...args)，可以向页面注入函数
    let aTags = await page.evaluate(() => {
      let as = [...document.querySelectorAll('ol li a')]
      return as.map(a => {
        return {
          href: a.href.trim(),
          name: a.text
        }
      })
    })
    await page.pdf({path: `./es6-pdf/${aTags[0].name}.pdf`})
    page.close()
    // 这里也可以使用promise all，但cpu可能吃紧，谨慎操作
    for (var i = 1; i < aTags.length; i++) {
      page = await browser.newPage()
      var a = aTags[i]
      await page.goto(a.href)
      await sleep(2000)
      await page.pdf({path: `./es6-pdf/${a.name}.pdf`})
      page.close()
    }

    browser.close()
  })
