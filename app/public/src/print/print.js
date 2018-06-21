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

    for (let page of src.pages) {
      let article = document.createElement('article')
      document.body.appendChild(article)
      let html = document.createElement('div')
      html.style.position = 'relative'
      html.style.width = article.offsetWidth - (src.margins.left + src.margins.right) + 'px'
      html.style.height = article.offsetWidth - (src.margins.top + src.margins.bottom) + 'px'
      html.style.top = src.margins.top + 'px'
      html.style.left = src.margins.left + 'px'
      html.innerHTML = page
      article.appendChild(html)
    }
    setTimeout(()=>{
      win.webContents.print({silent})
    },10)
})

ipcRenderer.on('pdf-request', (event, src, path) => {
    let i = 0
    let win = remote.getCurrentWindow()
    for (let page of JSON.parse(src).book) {
      let obj = JSON.parse(src)
      let article = document.createElement('article')
      document.body.appendChild(article)
      let html = document.createElement('div')
      html.style.position = 'relative'
      html.style.width = article.offsetWidth - (obj.config.margins.left + obj.config.margins.right) + 'px'
      html.style.height = article.offsetWidth - (obj.config.margins.top + obj.config.margins.bottom) + 'px'
      html.style.top = obj.config.margins.top + 'px'
      html.style.left = obj.config.margins.left + 'px'
      html.innerHTML = page[1]
      article.appendChild(html)
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
