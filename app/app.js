const electron = require('electron')
const { app, BrowserWindow, ipcMain, dialog, webFrame } = electron
const fs = require('fs')
const os = require('os')
const path = require('path')
const html2docx = require('html-docx-js')
const mammoth = require('mammoth')

let win

app.on('ready', () => {
  let {width, height} = electron.screen.getPrimaryDisplay().workAreaSize

  /**
  * @param { width, height } TEMP
  * Smallest is 1280x720 supported
  */
  // width = 1280
  // height = 720

  ipcMain.on('open-file', e => {
    dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        {name: 'All supported files', extensions: ['odyss', 'docx', 'txt']},
        {name: 'Odyssey files', extensions: ['odyss']},
        {name: 'Microsoft Word document files', extensions: ['docx']},
        {name: 'Text files', extensions: ['txt']},
        {name: 'All files', extensions: ['*']}
      ]
    }, files => {
      if (files) {

        if (path.extname(files[0]) == ".docx") {
          mammoth.convertToHtml({path: files[0]})
          .then(function(result){
            // If docx is converted incorrectly
            if (result.value == '') {
              fs.readFile(files[0], "utf-8", (err, data) => {
                if (err) throw err
                let content = /<body>([\s\S]*?)<\/body>/img.exec(data)[1]
                e.sender.send('selected-files', content, null)
              })
              // Otherwise
            } else {
              let data = result.value
              e.sender.send('selected-files', data, null)
            }
          })

        } else {
          fs.readFile(files[0], 'utf-8', (err, data) => {
            if (err) throw err
            e.sender.send('selected-files', data, files[0])
          })
        }

      }
    })
  })

  ipcMain.on('open-image', e => {
    dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        {name: 'All supported files', extensions: ['png','jpg','jpeg','jpe','gif']},
        {name: 'PNG images', extensions: ['png']},
        {name: 'JPEG images', extensions: ['jpg','jpeg','jpe']},
        {name: 'GIF images', extensions: ['gif']},
        {name: 'All files', extensions: ['*']}
      ]
    }, files => {
      if (files) {
        fs.readFile(files[0], (err, data) => {
          if (err) throw err
          e.sender.send('selected-image', [data, files[0]])
        })
      }
    })
  })

  ipcMain.on('save-file', (e, source) => {
    dialog.showSaveDialog({
      options: {},
      filters: [
        {name: 'Odyssey files', extensions: ['odyss']},
        {name: 'Microsoft Word document files', extensions: ['docx']},
        {name: 'PDF files', extensions: ['pdf']}
      ]
    },
    file => {
      if (file != undefined) {
        switch (path.extname(file)) {
          case '.odyss':
            (function(){
              // Write to odyssey
              fs.writeFile(file, source, err => {
                if (err) throw err
                e.sender.send('saved-file', file)
              })
            })()
            break;
          case '.docx':
            (function(){
              // Write to MS Word
              // FIXME: Margins
              let docx = html2docx.asBlob(`
                <!DOCTYPE html>
                <html>
                  <head></head>
                  <body>
                    ${
                      (function(){
                        let given = JSON.parse(source)
                        let content = ''
                        for (let page of given.book) {
                          content += ( page[1] + "<br>" )
                        }
                        return content
                      })()
                    }
                  </body>
                </html>
              `, { /* margins */ })
              fs.writeFile(file, docx, err => {
                if (err) throw err
                e.sender.send('saved-file', null)
              })
            })()
            break;
          case '.pdf':
            (function () {
              //Instatiate new printing process
              let pdfWin = new BrowserWindow({width: 794, height: 1122, show: true, parent: win})
              pdfWin.setMenu(null)
              pdfWin.loadURL("file://" + __dirname+'/public/print.html')
              // printWin.toggleDevTools()
              pdfWin.webContents.once("dom-ready", () => {
                pdfWin.webContents.send('pdf-request', source, file)
              })
            })()
            break;
        }
      }
    })
  })

  ipcMain.on('quick-save', (e,data)=>{
    if (!data[0]) {
      return dialog.showSaveDialog({
        options: {},
        filters: [
          {name: 'Odyssey files', extensions: ['odyss']}
        ]
      },
      file => {
        if (file != undefined) {
          fs.writeFile(file, data[1], err => {
            if (err) throw err

            e.sender.send('saved-file', file)
          })
      }})
    }
    fs.writeFile(data[0],data[1], err => {
      if (err) throw err
      e.sender.send('saved-file', data[0])
    })
  })

  win = new BrowserWindow({
    width,
    height,
    frame: false,
    show: false,
    icon:  __dirname + '/assets/icons/logo.png',
    opacity: 1
  })
  // win.toggleDevTools()
  win.setMenu(null)
  win.loadURL("file://" + __dirname+'/public/index.html')
  win.setBackgroundColor('#222')

  ipcMain.on('print', (e, src, silent) => {
    silent = silent == undefined ? false : true
    //Instatiate new printing process
    let printWin = new BrowserWindow({width: 794, height: 1122, show: true, parent: win})
    printWin.setMenu(null)
    printWin.loadURL("file://" + __dirname+'/public/print.html')
    // printWin.toggleDevTools()
    printWin.webContents.once("dom-ready", () => {
      printWin.webContents.send('print-request', src, silent)
    })
  })

  ipcMain.on('check-if-opened-with-file', e => {
    if (process.platform == 'win32' && process.argv.length >= 2) {
      var openFilePath = process.argv[1]
      // If it's opened in emulator
      if (openFilePath != '.') {

        fs.readFile(openFilePath, 'utf-8', (err, data) => {
          if (err) console.log(err)
          e.sender.send('selected-files', data, openFilePath)
        })
      }
    }
  })

  win.webContents.on('did-finish-load', () => {
    setTimeout(() => {
      win.show()
    },50)
  })

  // Closing process
  win.on('closed', () => {
    win = null
    app.quit()
  })
})

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') app.quit()
})
