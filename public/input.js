let input = {
  keydown : new Function(),
  keyup : new Function(),
  shift : false,
  v : false,
  a : false,
  move : { LMBRelease : false },
  comma : false,
  period : false,
}


move.docs.addEventListener("mouseup", () => { input.move.LMBRelease = true })
window.addEventListener("keydown", e =>{ input.keydown(e) })
window.addEventListener("keyup", e =>{ input.keyup(e) })

input.keydown = e => {
  switch (e.keyCode) {
    case 16:
      input.shift = true
      break;
    case 86:
      input.v = true
      break;
    case 65:
      input.a = true
      break;
    case 188:
      input.comma = true
      break;
    case 190:
      input.period = true
      break;
  }


  //Methodical Part
  if (input.shift && input.v && fv.bg.style.opacity == 0 && document.activeElement.tagName != "INPUT") {
    fv.bg.style.display = "inline-block"
    setTimeout(()=>{
      fv.bg.style.opacity = 1
      fv.on()
    },150)
  }
  if (input.shift && input.a && ctxMenu.style.opacity == 0 && document.activeElement.tagName != "INPUT") {
    ctxMenu.style.display = "inline-block"
    setTimeout(()=>{
      ctxMenu.style.opacity = 1
    },100)
  }
  if (input.comma) {
    input.comma = false
    turnLeft()
  }
  if (input.period) {
    input.period = false
    turnRight()
  }

}

input.keyup = e => {
  switch (e.keyCode) {
    case 16:
      input.shift = false
      break;
    case 86:
      input.v = false
      break;
    case 65:
      input.a = false
      break;
    case 188:
      input.comma = false
      break;
    case 190:
      input.period = false
      break;
  }
}
