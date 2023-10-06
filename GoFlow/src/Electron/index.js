const { app, BrowserWindow, ipcMain, dialog, globalShortcut } = require("electron");
const path = require('path');
const fsWrite = require("fs").promises;
const fsRead = require("fs");

let mainWindow = null;


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "../icons/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    zoomFactor: 1.0,
  });
  mainWindow.maximize()


  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  // Toggle open/close the DevTools.
  globalShortcut.register('CommandorControl+D', () => {
    if(mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.webContents.closeDevTools();
    } else {
      mainWindow.webContents.openDevTools();
    }
  });

  handleCommunication();
}

// This method will be called when Electron has finished initialization and is ready to create browser windows.
app.on("ready", () => {
  createWindow();
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


const handleCommunication = () => {
  ipcMain.removeHandler("saveData");
  ipcMain.removeHandler("restoreData");
  ipcMain.handle("saveData", async (event, data, name) => {
    try {
      const filePath = path.join(__dirname, `../WidgetData/${name}.json`); // Set your desired file path here
      await fsWrite.writeFile(filePath, data, "utf8");

      return { success: true };
    } catch (error) {
      return { error };
    }
  });
  

  ipcMain.handle("restoreData", async () => {
    try {
      const directoryPath = path.join(__dirname, '../WidgetData/');
      const files = await fsRead.promises.readdir(directoryPath);
      
      const filesData = await Promise.all(files.map(async (file) => {
        const filePath = path.join(directoryPath, file);
        const data = await fsRead.promises.readFile(filePath, "utf8");
        return JSON.parse(data);
      }));
      
      
      return { success: true, filesData: filesData };
    } catch (error) {
      console.error('Error:', error);
      return { error };
    }
  });

}
