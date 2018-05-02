const electron = require('electron')
const { ipcRenderer, remote } = electron
const fs = require('fs');

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

ipcRenderer.on('pdf-request', (event, src, path) => {
    let i = 0
    let win = remote.getCurrentWindow()
    for (let page of JSON.parse(src).book) {
      document.body.innerHTML += `
        <article>
          ${page[1]}
        </article>
      `
    }
    setTimeout(()=>{
      win.webContents.printToPDF({}, function (error, data) {
        if (error) throw error
        fs.writeFile(path, data, function (error) {
          if (error) {
            throw error
          }
          event.sender.send('saved-file', null)
        })
      })
    },10)
})
