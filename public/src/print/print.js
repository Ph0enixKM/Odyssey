const electron = require('electron')
const { ipcRenderer, remote } = electron

const qs = document.querySelectorAll.bind(document)

window.addEventListener('keydown', e => {
  let win = remote.getCurrentWindow()
  if (e.keyCode == 123) {
    win.toggleDevTools()
  }
})

ipcRenderer.on('print-request', (event, src) => {
  setTimeout(() => {
    let i = 0
    let win = remote.getCurrentWindow()

    setInterval(() => {
      if (i < src.length) {
        // Print pages
        qs('body')[0].innerHTML = src[i]
        win.webContents.print({silent: true})
        i++

      } else {
        // If no more pages
        win.close()
      }
    }, 1000)
  }, 200)
})
