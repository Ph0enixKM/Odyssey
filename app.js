const electron = require('electron');
const { app, BrowserWindow } = electron;


let win


app.on("ready", ()=>{
  let {width, height} = electron.screen.getPrimaryDisplay().workAreaSize

  /**
  * @param { width, height } TEMP
  * Smallest is 1280x720 supported
  */
  // width = 1280
  // height = 720


  win = new BrowserWindow({width, height, frame:false, show:false});
  // win.toggleDevTools();
  win.setMenu(null);
  win.loadURL("file://"+__dirname+"/public/index.html");

  win.setBackgroundColor("#222");

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
