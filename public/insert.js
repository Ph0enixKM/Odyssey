const insert = {
  addImageBtn : qs("#insert #image")[0],
}

insert.addImageBtn.addEventListener("click",()=>{
  // Open file Dialog
  ipcRenderer.send("open-image")
})

ipcRenderer.on("selected-image",(event,image)=>{
  // Show up image

  let source = `<img type="image/tiff" src='data:image/png;base64, ${Buffer.from(image).toString('base64')}'
  style="width:${textField.contentDocument.body.offsetWidth}px"/>`
  textField.contentDocument.execCommand('insertHTML',false,source)
})
