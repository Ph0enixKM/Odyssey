const electron = require('electron')
const { app, BrowserWindow, ipcMain, dialog, webFrame } = electron
const fs = require('fs')
const os = require('os')

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
        {name: 'Odyssey files', extensions: ['odyss']},
        {name: 'Text files', extensions: ['txt']},
        {name: 'Microsoft Word document files', extensions: ['docx']},
        {name: 'All files', extensions: ['*']}
      ]
    }, files => {
      if (files) {
        // e.sender.send('selected-files',files)

        fs.readFile(files[0], 'utf-8', (err, data) => {
          if (err) console.log(err)
          e.sender.send('selected-files', data, files[0])
        })
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
        // e.sender.send('selected-files',files)

        fs.readFile(files[0], (err, data) => {
          if (err) console.log(err)
          e.sender.send('selected-image', data)
        })
      }
    })
  })

  ipcMain.on('save-file', (e, source) => {
    dialog.showSaveDialog({
      options: {},
      filters: [
        {name: 'Odyssey files', extensions: ['odyss']}
      ]
    },
    file => {
      if (file != undefined) {
        fs.writeFile(file, source, err => {
          if (err) throw err

          e.sender.send('saved-file', file)
        })
      }
    })
  })

  win = new BrowserWindow({width, height, frame: false, show: false})
  // win.toggleDevTools();
  win.setMenu(null)
  win.loadURL("file://" + __dirname+'/public/index.html')
  win.setBackgroundColor('#222')

  ipcMain.on('print-all', (e,src) => {
    //Instatiate new printing process
    printWin = new BrowserWindow({width: 210*3, height: 297*3, show: true})
    printWin.setMenu(null)
    printWin.loadURL("file://" + __dirname+'/public/print.html')

    printWin.webContents.once("dom-ready", () => {
      // printWin.toggleDevTools()
      printWin.webContents.send('print-request',src)
      setTimeout(()=>{
        printWin.webContents.print({silent: false})
      },500)
    })
  })


  // QUESTION: Printing can be also done using webContents
  // console.log(win.webContents);
  // WARNING: Zrób tak, żeby było osobne okno do wydruku :D

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
      // setTimeout(()=>{
      //   win.webContents.print({silent:false},()=>{
      //     console.log("printed");
      //   })
      // },5000)
    }, 50)
  })

  // Closing process
  win.on('closed', () => {
    win = null
    printWin.close()
  })
})

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') app.quit()
})
