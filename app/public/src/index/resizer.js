window.resizer = {
  top : document.querySelector('.resizer.top'),
  bottom : document.querySelector('.resizer.bottom'),
  left : document.querySelector('.resizer.left'),
  right : document.querySelector('.resizer.right'),

  sel : undefined,

  offset : 30,
  update : new Function(),
  apply : new Function(),
  mouseUp : new Function(),
  mouseDown : new Function(),
  body : document.querySelector('.iframe'),
  scrolled : false,
  time : null, // It's a Time Interval
  opacity : null, // It's a TimeOut

  x : 0,
  y : 0,
}

resizer.update = () => {
  // Top
  resizer.top.style.top = textField.offsetTop - resizer.body.scrollTop + margins.top + "px"
  resizer.top.style.left = textField.offsetLeft + "px"
  // Left
  resizer.left.style.top = textField.offsetTop - resizer.body.scrollTop - margins.top + "px"
  resizer.left.style.left = textField.offsetLeft + margins.left + "px"
  resizer.left.style.marginTop = margins.top
  // Right
  resizer.right.style.top = textField.offsetTop - resizer.body.scrollTop - margins.top + "px"
  resizer.right.style.left = textField.offsetLeft + textField.offsetWidth - margins.right + "px"
  resizer.right.style.marginTop = margins.top
  // Bottom
  resizer.bottom.style.top = textField.offsetTop + textField.offsetHeight - resizer.body.scrollTop - margins.bottom + "px"
  resizer.bottom.style.left = textField.offsetLeft + "px"
}
resizer.apply = () => {
  switch (resizer.sel) {
    case resizer.top:
      margins.top = resizer.y - textField.offsetTop - 2 + resizer.body.scrollTop
      break
    case resizer.left:
      margins.left = resizer.x - textField.offsetLeft
      break
    case resizer.bottom:
      margins.bottom = textField.offsetTop + textField.offsetHeight - (resizer.y + resizer.body.scrollTop)
      break
    case resizer.right:
      margins.right = textField.offsetLeft + textField.offsetWidth - resizer.x
      break
  }
  let html = textField.contentDocument.documentElement
  // Top + Bottom
  html.style.height = pageDefaults.height - (margins.top + margins.bottom) + 'px'
  html.style.top = margins.top + 'px'
  // Left + Right
  html.style.width = pageDefaults.width - (margins.left + margins.right) + 'px'
  html.style.left = margins.left + 'px'

  BASE_FILE.config.margins = margins

  resizer.update()
}
// On load Stuff
window.onload = () => {
  resizer.update()
  resizer.apply()
}

textField.addEventListener('mousemove', e => {
  resizer.x = e.x
  resizer.y = e.y
})
textField.contentWindow.addEventListener('mousemove', e => {
  resizer.x = e.x + textField.offsetLeft
  resizer.y = e.y + textField.offsetTop - resizer.body.scrollTop
})

resizer.body.addEventListener('scroll', () => {
  resizer.scrolled = true
  resizer.top.style.opacity = resizer.left.style.opacity
  resizer.update(0)
})

window.addEventListener('resize', () => {
  resizer.update(0)
})

resizer.top.addEventListener('mousedown', () => resizer.mouseDown('top') )
resizer.bottom.addEventListener('mousedown', () => resizer.mouseDown('bottom') )
resizer.right.addEventListener('mousedown', () => resizer.mouseDown('right') )
resizer.left.addEventListener('mousedown', () => resizer.mouseDown('left') )

resizer.mouseDown = (name) => {
  resizer.update(0)
  resizer.sel = resizer[name]
  resizer.sel.style.boxShadow = '0 0 0 100px orange inset'
  resizer.time = setInterval( () => {
    if (name == 'top' || name == 'bottom')
      resizer[name].style.top = resizer.y
    if (name == 'left' || name == 'right')
      resizer[name].style.left = resizer.x
  }, 16);
}


resizer.mouseUp = () => {
  resizer.update(0)
  clearInterval(resizer.time)
  if (resizer.sel != null) {
    resizer.sel.style.boxShadow = '0 0 0 transparent inset'
    resizer.apply(0)
  }
  resizer.sel = null
}

window.addEventListener('mouseup', resizer.mouseUp)
textField.contentWindow.addEventListener('mouseup', resizer.mouseUp)
