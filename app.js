const electron = require('electron');
const { app, BrowserWindow } = electron;


let win


app.on("ready", ()=>{
  win = new BrowserWindow({width: 1620, height: 1080, frame:false, show:false});
  // win.toggleDevTools();
  win.setMenu(null);
  win.loadURL("file://"+__dirname+"/public/index.html");

  win.setBackgroundColor("#000");

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
