window.resizer = {
  top : document.querySelector('.resizer.top'),
  bottom : document.querySelector('.resizer.bottom'),
  left : document.querySelector('.resizer.left'),

  offset : 30,
  update : new Function(),
  body : document.querySelector('.iframe'),
  scrolled : false
}

resizer.update = (offset) => {
  // Top
  resizer.top.style.top = textField.offsetTop - resizer.body.scrollTop - offset - 5 + margins.top + "px"
  resizer.top.style.left = textField.offsetLeft + "px"
  resizer.top.style.transform = 'translate(0,-5px)'
  // Left
  resizer.left.style.top = textField.offsetTop - resizer.body.scrollTop - ((offset == 18) ? 22 : offset) - margins.top + "px"
  resizer.left.style.left = textField.offsetLeft + margins.left + "px"
  resizer.left.style.transform = 'translate(-5px, 0)'
  resizer.left.style.marginTop = margins.top
  // Bottom
  resizer.bottom.style.top = textField.offsetTop + textField.offsetHeight - resizer.body.scrollTop - offset - margins.bottom + "px"
  resizer.bottom.style.left = textField.offsetLeft + "px"
}
resizer.update(18)

resizer.body.addEventListener('scroll', () => {
  resizer.scrolled = true
  resizer.update(0)
})

window.addEventListener('resize', () => {
  resizer.update(0)
})

resizer.top.addEventListener('click', () => {
  margins.top = 0
  resizer.update(0)
})
