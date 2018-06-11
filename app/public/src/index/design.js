window.textField = qs("iframe")[0] //Just to remind the compiler

window.design = {
  addImageBtn : qs("#design #image")[0],
  sizer : qs("#sizer")[0],
  sel : undefined,
  sizerLoop : new Function(),
  sizerState : false,
  canvas : document.createElement("canvas"),
  context : function() {return this.canvas.getContext("2d")},
}

design.addImageBtn.addEventListener("click",()=>{
  // Open file Dialog
  ipcRenderer.send("open-image")
})


textField.contentWindow.addEventListener("mousemove", e =>{
  if (design.sizerState == true) {
    design.sel.style.width = e.x - design.sel.offsetLeft + "px"
  }
})

// Apply changes (size)
textField.contentDocument.documentElement.addEventListener("click", e =>{
  if (design.sizerState == true) {
    design.sizerState = false
  }
})

// Enable sizer
sizer.addEventListener("click",e =>{
  e.stopPropagation()
  if (design.sizerState == false) {
    design.sizerState = true
  }
})

// Disable sizer
qs("iframe")[0].contentDocument.documentElement.addEventListener("click",e =>{
  if (design.sizerState == false) {

    if(design.sel != undefined){
      design.sel.state = false
      sizer.style.opacity = 0
      setTimeout(()=>{
        sizer.style.display = "none"
        sizer.sel = undefined
      },200)
      clearInterval(design.sel.loop)
    }
  }
})

ipcRenderer.on("selected-image",(event, arr)=>{

  merge.loading.style.display = "inline-block"
  merge.loading.style.opacity = 0
  merge.gif.style.transform = "rotate(30deg) scale(0)"
  merge.innerMsg.innerHTML = "Optymalizowanie zdjęcia"

  merge.loading.style.opacity = 1
  merge.gif.style.transform = "rotate(0deg) scale(1)"
  setTimeout(()=>{

    // Show up image
    let elem = document.createElement("IMG")
    elem.src = 'data:image/png;base64, ' + Buffer.from(arr[0]).toString('base64')
    elem.width = textField.contentDocument.body.offsetWidth-4
    elem.className = "image"
    elem.state = false
    elem.loaded = false



    elem.onload = () =>{
      if (!elem.loaded) {

        design.canvas.width = elem.width
        design.canvas.height = elem.height
        design.context().drawImage(elem,0,0,elem.width,elem.height)
        let src = arr[1].match(/.png$/)
          ? design.canvas.toDataURL("image/png")
          : design.canvas.toDataURL("image/jpeg",Number(SETTINGS.imageQuality))
        elem.src = src
        elem.loaded = true
      setTimeout(()=>{
        merge.loading.style.opacity = 0
        merge.gif.style.transform = "rotate(30deg) scale(0)"
        setTimeout(()=>{
          merge.loading.style.display = "none"
        },300)
      },500)
    }
  }
    textField.contentDocument.body.appendChild(elem)
  },300)
  })
