const { app, BrowserWindow, ipcMain, dialog, globalShortcut } = require("electron");
const path = require('path');
const fs = require("fs/promises");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  // Toggle open/close the DevTools.
  globalShortcut.register('CommandorControl+D', () => {
    if(mainWindow.webContents.isDevToolsOpened()){mainWindow.webContents.closeDevTools()}else{mainWindow.webContents.openDevTools()}
  });

  handleCommunication()
}    

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () =>{
  createWindow()
})
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  app.quit();
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const handleCommunication = () => {
  ipcMain.removeHandler("saveData");
  ipcMain.removeHandler("restoreData");
  ipcMain.handle("saveData", async (event, data) => {
    try {
      const filePath = path.join(__dirname, '../test.json'); // Set your desired file path here
      console.log("hey", file)
      await fs.writeFile(filePath, data, "utf8");

      return { success: true };
    } catch (error) {
      return { error };
    }
  });
  ipcMain.handle("restoreData", async () => {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [
          {
            name: "json",
            extensions: ["json"],
          },
        ],
      });

      if (!canceled) {
        const [filePath] = filePaths;
        const data = await fs.readFile(filePath, "utf8");

        return { success: true, data };
      } else {
        return { canceled };
      }
    } catch (error) {
      return { error };
    }
  });
};