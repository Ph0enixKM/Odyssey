window.textField = qs("iframe")[0] //Just to remind the compiler

window.insert = {
  addImageBtn : qs("#insert #image")[0],
  sizer : qs("#sizer")[0],
  sel : undefined,
  sizerLoop : new Function(),
  sizerState : false,
  canvas : document.createElement("canvas"),
  context : function() {return this.canvas.getContext("2d")},
}

insert.addImageBtn.addEventListener("click",()=>{
  // Open file Dialog
  ipcRenderer.send("open-image")
})


textField.contentWindow.addEventListener("mousemove", e =>{
  if (insert.sizerState == true) {
    insert.sel.style.width = e.x - insert.sel.offsetLeft + "px"
  }
})

// Apply changes (size)
textField.contentDocument.documentElement.addEventListener("click", e =>{
  if (insert.sizerState == true) {
    insert.sizerState = false
  }
})

// Enable sizer
sizer.addEventListener("click",e =>{
  e.stopPropagation()
  if (insert.sizerState == false) {
    insert.sizerState = true
  }
})

// Disable sizer
qs("iframe")[0].contentDocument.documentElement.addEventListener("click",e =>{
  if (insert.sizerState == false) {

    if(insert.sel != undefined){
      insert.sel.state = false
      sizer.style.opacity = 0
      setTimeout(()=>{
        sizer.style.display = "none"
        sizer.sel = undefined
      },200)
      clearInterval(insert.sel.loop)
    }
  }
})

ipcRenderer.on("selected-image",(event,image)=>{

  merge.loading.style.display = "inline-block"
  merge.loading.style.opacity = 0
  merge.gif.style.transform = "rotate(30deg) scale(0)"
  merge.innerMsg.innerHTML = "Optymalizowanie zdjęcia"

  merge.loading.style.opacity = 1
  merge.gif.style.transform = "rotate(0deg) scale(1)"
  setTimeout(()=>{

    // Show up image
    let elem = document.createElement("IMG")
    elem.src = 'data:image/png;base64, ' + Buffer.from(image).toString('base64')
    elem.width = textField.contentDocument.body.offsetWidth-4
    elem.className = "image"
    elem.state = false
    elem.loaded = false



    elem.onload = () =>{
      if (!elem.loaded) {
          insert.canvas.width = elem.width
          insert.canvas.height = elem.height
          insert.context().drawImage(elem,0,0,elem.width,elem.height)
          let src = insert.canvas.toDataURL("image/jpeg",Number(SETTINGS.imageQuality))
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

    // TODO: Make it more usable
    // elem.addEventListener("click",e =>{
    //   e.stopPropagation()
    //   if(insert.sel != undefined){
    //     insert.sel.state = false
    //     sizer.style.opacity = 0
    //     setTimeout(()=>{
    //       sizer.style.display = "none"
    //       sizer.sel = undefined
    //     },200)
    //     clearInterval(insert.sel.loop)
    //   }
    //     elem.state = !elem.state
    //
    //     setTimeout(()=>{
    //       sizer.style.display = "inline-block"
    //       sizer.style.opacity = 1
    //       insert.sel = elem
    //     },200)
    //     elem.loop = setInterval(()=>{
    //       sizer.style.top = elem.offsetTop+textField.offsetTop+70+elem.offsetHeight-sizer.offsetHeight/2-bodyContent.scrollTop+"px"
    //       sizer.style.left = elem.offsetLeft+textField.offsetLeft+70+elem.offsetWidth-sizer.offsetHeight/2+"px"
    //     },10)
    // })
    //
    // elem.addEventListener("contextmenu",e => {
    //   e.stopPropagation()
    //   if(insert.sel != undefined){
    //     insert.sel.state = false
    //     sizer.style.opacity = 0
    //     setTimeout(()=>{
    //       sizer.style.display = "none"
    //       sizer.sel = undefined
    //     },200)
    //     clearInterval(insert.sel.loop)
    //   }
    // })


    // textField.contentDocument.execCommand('insertHTML',false,elem.outerHTML)
    textField.contentDocument.body.appendChild(elem)
  },300)
  })
