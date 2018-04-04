const electron = require('electron')
const { ipcRenderer, remote } = electron

const qs = document.querySelectorAll.bind(document)

window.addEventListener('keydown', e => {
  let win = remote.getCurrentWindow()
  if (e.keyCode == 123) {
    win.toggleDevTools()
  }
})

ipcRenderer.on('print-request', (event, src, silent) => {
    let i = 0
    let win = remote.getCurrentWindow()
    for (let page of src) {
      document.body.innerHTML += `
        <article>
          ${page}
        </article>
      `
    }
    setTimeout(()=>{
      win.webContents.print({silent})
    },10)
})
