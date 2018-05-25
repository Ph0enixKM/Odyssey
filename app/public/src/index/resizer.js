window.resizer = {
  top : document.querySelector('.resizer.top'),
  bottom : document.querySelector('.resizer.bottom'),
  left : document.querySelector('.resizer.left'),
  right : document.querySelector('.resizer.right'),

  sel : undefined,

  offset : 30,
  update : new Function(),
  mouseUp : new Function(),
  mouseDown : new Function(),
  body : document.querySelector('.iframe'),
  scrolled : false,
  time : null, // It's a Time Interval
  opacity : null, // It's a TimeOut

  x : 0,
  y : 0,
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
  // Right
  resizer.right.style.top = textField.offsetTop - resizer.body.scrollTop - ((offset == 18) ? 22 : offset) - margins.top + "px"
  resizer.right.style.left = textField.offsetLeft + textField.offsetWidth - margins.right + "px"
  resizer.right.style.transform = 'translate(5px, 0)'
  resizer.right.style.marginTop = margins.top
  // Bottom
  resizer.bottom.style.top = textField.offsetTop + textField.offsetHeight - resizer.body.scrollTop - offset - margins.bottom + "px"
  resizer.bottom.style.left = textField.offsetLeft + "px"
}
resizer.update(18)

textField.addEventListener('mousemove', e => {
  resizer.x = e.x
  resizer.y = e.y
})
textField.contentWindow.addEventListener('mousemove', e => {
  resizer.x = e.x + textField.offsetLeft + margins.left
  resizer.y = e.y + textField.offsetTop + margins.top - resizer.body.scrollTop
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
  if (resizer.sel != null)
    resizer.sel.style.boxShadow = '0 0 0 transparent inset'
}

window.addEventListener('mouseup', resizer.mouseUp)
textField.contentWindow.addEventListener('mouseup', resizer.mouseUp)
