let input = {
  keydown : new Function(),
  keyup : new Function(),
  shift : false,
  v : false,
  move : { LMBRelease : false },
}


move.docs.addEventListener("mouseup", () => { input.move.LMBRelease = true })
window.addEventListener("keydown", e =>{ input.keydown(e) })
window.addEventListener("keyup", e =>{ input.keyup(e) })

input.keydown = (e) => {
  switch (e.keyCode) {
    case 16:
      input.shift = true
      break;
    case 86:
      input.v = true
  }

  //Methodical Part
  if (input.shift && input.v && fv.bg.style.opacity == 0) {
    fv.bg.style.display = "inline-block"
    setTimeout(()=>{
      fv.bg.style.opacity = 1
      fv.on()
    },150)
  }

}

input.keyup = (e) => {
  switch (e.keyCode) {
    case 16:
      input.shift = false
      break;
    case 86:
      input.v = false
  }
}
