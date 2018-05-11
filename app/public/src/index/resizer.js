window.resizer = {
  top : document.querySelector('.resizer.top'),
  bottom : document.querySelector('.resizer.bottom'),
  left : document.querySelector('.resizer.left'),

  offset : 30,
  update : new Function(),
  body : document.querySelector('.iframe')
}

resizer.update = (offset) => {
  // Top
  resizer.top.style.top = textField.offsetTop - resizer.body.scrollTop - offset - 5 + margins.top + "px"
  resizer.top.style.left = textField.offsetLeft + "px"
  // Left
  resizer.left.style.top = textField.offsetTop - resizer.body.scrollTop - offset - margins.top + "px"
  resizer.left.style.left = textField.offsetLeft + margins.left + "px"
  // Bottom
  resizer.bottom.style.top = textField.offsetTop + textField.offsetHeight - resizer.body.scrollTop - offset - margins.bottom + "px"
  resizer.bottom.style.left = textField.offsetLeft + "px"
}
resizer.update(18)

resizer.body.addEventListener('scroll', () => resizer.update(0))

resizer.top.addEventListener('click', () => {
  margins.top = 0
  resizer.update(0)
})
