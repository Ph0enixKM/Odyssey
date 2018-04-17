textField = qs('iframe')[0] // Just to remind the compiler

window.input = {
  keydown: new Function(),
  keyup: new Function(),
  keydownIn: new Function(),
  keyupIn: new Function(),
  shift: false,
  v: false,
  a: false,
  bIn: false,
  iIn: false,
  uIn: false,
  move: { LMBRelease: false },
  comma: false,
  period: false,
  ctrl: false,
  ctrlIn: false,
  s: false
}

move.docs.addEventListener('mouseup', () => { input.move.LMBRelease = true })
window.addEventListener('keydown', e => { input.keydown(e) })
window.addEventListener('keyup', e => { input.keyup(e) })

input.keydown = e => {
  switch (e.keyCode) {
    case 16:
      input.shift = true
      break
    case 86:
      input.v = true
      break
    case 65:
      input.a = true
      break
    case 188:
      input.comma = true
      break
    case 190:
      input.period = true
      break
    case 17:
      input.ctrl = true
      break
    case 83:
      input.s = true
      break
  }

  // Methodical Part
  if (input.shift && input.v && fv.bg.style.opacity == 0 && document.activeElement.tagName != 'INPUT') {
    fv.bg.style.display = 'inline-block'
    setTimeout(() => {
      fv.bg.style.opacity = 1
      fv.on()
    }, 150)
  }
  if (input.shift && input.a && ctxMenu.style.opacity == 0 && document.activeElement.tagName != 'INPUT') {
    ctxMenu.style.display = 'inline-block'
    setTimeout(() => {
      ctxMenu.style.opacity = 1
    }, 100)
  }
  if (input.comma) {
    input.comma = false
    turnLeft()
  }
  if (input.period) {
    input.period = false
    turnRight()
  }
  if (input.s && input.ctrl) {
    // Negate keys
    input.ctr = false
    input.s = false
    let path = qs('.menubar .bar span')[0].innerHTML == '&lt;Brak tytułu&gt;'
      ? false
      : qs('.menubar .bar span')[0].innerHTML
    ipcRenderer.send('quick-save',[path, JSON.stringify(BASE_FILE)])
  }
}

input.keyup = e => {
  switch (e.keyCode) {
    case 16:
      input.shift = false
      break
    case 86:
      input.v = false
      break
    case 65:
      input.a = false
      break
    case 188:
      input.comma = false
      break
    case 190:
      input.period = false
      break
    case 17:
      input.ctrl = false
      break
    case 83:
      input.s = false
      break

  }
}

textField.contentWindow.addEventListener('keydown', e => { input.keydownIn(e) })
textField.contentWindow.addEventListener('keyup', e => { input.keyupIn(e) })

input.keydownIn = e => {
  switch (e.keyCode) {
    case 66:
      input.bIn = true
      break
    case 73:
      input.iIn = true
      break
    case 85:
      input.uIn = true
      break
    case 17:
      input.ctrlIn = true
      break
  }

  // Methodical Section
  if (input.ctrlIn && input.bIn) {
    command('bold')
  }
  if (input.ctrlIn && input.iIn) {
    command('italic')
  }
  if (input.ctrlIn && input.uIn) {
    command('underline')
  }
}

input.keyupIn = e => {
  switch (e.keyCode) {
    case 66:
      input.bIn = false
      break
    case 73:
      input.iIn = false
      break
    case 85:
      input.uIn = false
      break
    case 17:
      input.ctrlIn = false
      break
  }
}
