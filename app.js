const electron = require('electron');
const { app, BrowserWindow } = electron;

app.on("ready", ()=>{
  let win = new BrowserWindow({width: 1620, height: 1080, frame:false});
  // win.toggleDevTools();
  win.setMenu(null);
  win.loadURL("file://"+__dirname+"/public/index.html");

  //Closing process
  app.on('window-all-closed', app.quit);
  app.on('before-quit', () => {
    mainWindow.removeAllListeners('close');
    mainWindow.close();
  });
})
