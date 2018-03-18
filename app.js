const electron = require('electron')
const { app, BrowserWindow, ipcMain, dialog } = electron
const fs = require('fs');

let win


app.on("ready", ()=>{
  let {width, height} = electron.screen.getPrimaryDisplay().workAreaSize

  /**
  * @param { width, height } TEMP
  * Smallest is 1280x720 supported
  */
  // width = 1280
  // height = 720

  ipcMain.on('open-file',e =>{
    dialog.showOpenDialog({
      properties : ['openFile'],
      filters : [
        {name : 'Odyssey files', extensions : ["odyss"]},
        {name : 'Text files', extensions : ["txt"]},
        {name : 'Microsoft Word document files', extensions : ["docx"]},
        {name : 'All files', extensions : ["*"]},
      ]
    }, files =>{
      if (files){ //e.sender.send('selected-files',files)
        fs.readFile(files[0], 'utf-8', (err,data)=>{
          if (err) console.log(err)
          e.sender.send('selected-files',data)
        })

      }
    })
  })

  ipcMain.on("save-file", (e,source) =>{
    dialog.showSaveDialog({
      options : {},
      filters : [
        {name : 'Odyssey files', extensions : ["odyss"]},
      ]
    },
    file =>{
      if (file != undefined) {
        fs.writeFile(file, source, err => {
          if (err) throw err
        })
      }
    })
  })





  win = new BrowserWindow({width, height, frame:false, show:false});
  // win.toggleDevTools();
  win.setMenu(null);
  win.loadURL("file://"+__dirname+"/public/index.html");

  win.setBackgroundColor("#222");

  ipcMain.on('check-if-opened-with-file',e =>{
    if (process.platform == 'win32' && process.argv.length >= 2) {
      var openFilePath = process.argv[1]
      fs.readFile(openFilePath, 'utf-8', (err,data)=>{
        if (err) console.log(err)
        e.sender.send('selected-files',data)
      })
      // dialog.showMessageBox({type : "info",message : openFilePath})
    }
  })

  win.webContents.on("did-finish-load", ()=>{
    setTimeout(()=>{
      win.show();
    },50)
  })

  //Closing process
  win.on("closed", ()=>{ win = null })
})

app.on('window-all-closed', ()=> {
  if(process.platform != "darwin") app.quit()
});
