const {app,BrowserWindow} = require('electron')

function createWindow (fileName) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "kula.ico"
  })
  win.setMenuBarVisibility(false)
  win.loadFile(fileName)
}

app.whenReady().then(() => {
  createWindow("index.html")

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length===0) createWindow("index.html")
  })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})