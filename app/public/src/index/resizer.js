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
  resizer.top.style.top = resizer.body.offsetTop - resizer.offset - resizer.body.scrollTop + 107 + margins.top + offset + "px"
  // Bottom
  // resizer.bottom.style.top = textField.offsetTop + textField.offsetHeight - resizer.offset + 170 + "px"
}
resizer.update(0)

resizer.body.addEventListener('scroll', () => resizer.update(18))

resizer.top.addEventListener('click', () => {
  margins.top = 0
  resizer.update(18)
})
