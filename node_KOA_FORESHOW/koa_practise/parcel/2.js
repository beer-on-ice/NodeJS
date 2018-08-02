function setButton (arr) {
  var btnHtml = ''
  for (var i of arr) {
    btnHtml += `
			<button class="btn" type="button">${i}</button>
		`
  }
  return btnHtml
}

module.exports = {
  setButton: setButton
}
