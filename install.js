const electronInstaller = require('electron-winstaller')

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: __dirname + '/out/Odyssey-win32-x64',
    outputDirectory: __dirname + '/out/installer64',
    authors: 'Phoenix Arts',
    exe: 'Odyssey.exe',
    loadingGif: __dirname + '/app/assets/setup.gif',
    setupIcon: __dirname + '/app/assets/icons/logo.ico',
    iconUrl: __dirname + '/app/assets/icons/logo.ico',
})
resultPromise.then(
  () => console.log("Creating instalator completed successfully!"),
  (e) => console.log(`No dice: ${e.message}`)
)
