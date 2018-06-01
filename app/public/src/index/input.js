textField = qs('iframe')[0] // Just to remind the compiler

window.input = {
  keydown: new Function(),
  keyup: new Function(),
  keydownIn: new Function(),
  keyupIn: new Function(),
  shift: false,
  v: false,
  a: false,
  move: { LMBRelease: false },
  digits: new Array(10),
  comma: false,
  period: false,
  ctrl: false,
  s: false,
  o: false,
  esc: false,
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
    case 79:
      input.o = true
      break
    case 27:
      input.esc = true
      break
  }
  for (let i = 48; i < 58; i++) {
    if (e.keyCode == i)
      input.digits[i - 48] = true
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
  if (input.comma && document.activeElement.tagName == "BODY") {
    input.comma = false
    turnLeft()
  }
  if (input.period && document.activeElement.tagName == "BODY") {
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
  if (input.o && input.ctrl) {
    // Negate keys
    input.ctr = false
    input.o = false
    ipcRenderer.send('open-file')
  }
  // Numerical shortcuts
  for (let i = 0; i < input.digits.length; i++) {
    try {
      if (qs('div.menu')[1].style.display == 'inline-block') {
        if (input.digits[i]) {
          qs('div.menu')[1].children[(i-1) % 10].click()
          input.digits[i] = false
        }
      }

      if (qs('#tools')[0].style.display == 'inline-block') {
        if (input.digits[i]) {
          qs('#tools')[0].children[(i-1) % 10].click()
          input.digits[i] = false
        }
      } else if (qs('#insert')[0].style.display == 'inline-block') {
        if (input.digits[i]) {
          qs('#insert')[0].children[(i-1) % 10].click()
          input.digits[i] = false
        }
      } else if (qs('#view')[0].style.display == 'inline-block') {
        if (input.digits[i]) {
          qs('#view')[0].children[(i-1) % 10].click()
          input.digits[i] = false
        }
      } else if (qs('#pages')[0].style.display == 'inline-block') {
        if (input.digits[i]) {
          qs('#pages')[0].children[(i-1) % 10].click()
          input.digits[i] = false
        }
      } else if (qs('#project')[0].style.display == 'inline-block') {
        if (input.digits[i]) {
          input.digits[i] = false
          qs('#project')[0].children[(i-1) % 10].click()
          if (
              qs('#project')[0].children[(i-1) % 10].tagName == 'INPUT'
              && document.activeElement == document.body
            ){
            setTimeout(()=>{
              qs('#project')[0].children[(i-1) % 10].focus()
            },10)
          } else if (
              qs('#project')[0].children[(i-1) % 10].children[0].tagName == 'INPUT'
              && document.activeElement == document.body
            ){
            setTimeout(()=>{
              qs('#project')[0].children[(i-1) % 10].children[0].focus()
            },10)
          }
        }
        if (input.esc) {
          if (qs('#project')[0].children[(i-1) % 10].tagName == 'INPUT'){
            qs('#project')[0].children[(i-1) % 10].blur()
          } else if (qs('#project')[0].children[(i-1) % 10].children[0].tagName == 'INPUT') {
            qs('#project')[0].children[(i-1) % 10].children[0].blur()
          }
        }
      }
    } catch (e) { /* pass */ }
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
    case 79:
      input.o = true
      break
    case 27:
      input.esc = false
      break
  }
  for (let i = 48; i < 58; i++) {
    if (e.keyCode == i)
      input.digits[i - 48] = false
  }
}
