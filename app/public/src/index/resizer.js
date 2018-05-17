window.resizer = {
  top : document.querySelector('.resizer.top'),
  bottom : document.querySelector('.resizer.bottom'),
  left : document.querySelector('.resizer.left'),
  right : document.querySelector('.resizer.right'),

  sel : undefined,

  offset : 30,
  update : new Function(),
  mouseUp : new Function(),
  body : document.querySelector('.iframe'),
  scrolled : false,
  time :- null, // It's a Time Interval

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

window.addEventListener('mousemove', e => {
  resizer.x = e.x
  resizer.y = e.y
})
textField.contentWindow.addEventListener('mousemove', e => {
  resizer.x = e.x + textField.offsetLeft + margins.left
  resizer.y = e.y + textField.offsetTop + margins.top
})

resizer.body.addEventListener('scroll', () => {
  resizer.scrolled = true
  resizer.update(0)
})

window.addEventListener('resize', () => {
  resizer.update(0)
})

resizer.top.addEventListener('mousedown', () => {
  // margins.top = 0
  resizer.update(0)
  console.log("up")
  resizer.sel = resizer.top
  resizer.sel.style.boxShadow = '0 0 0 100px orange inset'
  resizer.time = setInterval( () => {
    resizer.top.style.top = resizer.y
  }, 16);
})

resizer.mouseUp = () => {
  // margins.top = 0
  resizer.update(0)
  console.log("down")
  clearInterval(resizer.time)
  resizer.sel.style.boxShadow = '0 0 0 transparent inset'
}

window.addEventListener('mouseup', resizer.mouseUp)
textField.contentWindow.addEventListener('mouseup', resizer.mouseUp)
