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
  qs('body')[0].innerHTML = src
})
