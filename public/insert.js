const insert = {
  addImageBtn : qs("#insert #image")[0],
}

insert.addImageBtn.addEventListener("click",()=>{
  // Open file Dialog
  ipcRenderer.send("open-image")
})

ipcRenderer.on("selected-image",(event,image)=>{
  // Show up image

  let source = `<img type="image/tiff" class="image" src='data:image/png;base64, ${Buffer.from(image).toString('base64')}'
  style="width:${textField.contentDocument.body.offsetWidth-4}px
  "/>`
  // TODO: change <img> to <div> just to make resizer to be added

  console.log(textField.contentWindow.getSelection())

  if (textField.contentWindow.getSelection().focusNode === null) {
    textField.contentDocument.body.focus()
  }

  textField.contentDocument.execCommand('insertHTML',false,source)
})
