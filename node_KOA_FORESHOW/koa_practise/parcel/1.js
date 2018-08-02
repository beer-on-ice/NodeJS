var setButton = require('./2').setButton
var setColor = require('./3').setColor

var btnsTxt = ['原谅的颜色', '寂寞的颜色', '花儿的颜色']
document.getElementById('btnBox').innerHTML = setButton(btnsTxt)

var btns = document.getElementsByClassName('btn')
for (let i = 0; i < btns.length; i++) {
  btns[i].onclick = function () {
    var color = setColor(this.textContent)
    document.getElementsByClassName('hat')[0].style.backgroundColor = color
    document.getElementById('txt').style.color = color
  }
}
