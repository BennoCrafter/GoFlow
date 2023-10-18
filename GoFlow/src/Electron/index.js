const { app, BrowserWindow, ipcMain, globalShortcut, contextBridge, screen } = require("electron");
const path = require('path');
const fsRead = require("fs");
const fs = require("fs");
let mainWindow = null;


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  console.log( path.join(__dirname, "../icons/icon.jpg"))
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "../icons/icon.ico"),
    nodeIntegration: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
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
  ipcMain.handle("saveData", async (event, data, name, projectName, pageName) => {
    try {
      const filePath = path.join(__dirname, `../SavedData/${projectName}/${pageName}/${name}.json`); // Set your desired file path here
      await fs.promises.writeSync(filePath, data, "utf8");

      return { success: true };
    } catch (error) {
      return { error };
    }
  });
  

  ipcMain.handle("getWidgetData", async () => {
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

  ipcMain.handle("restoreData", async () => {
    try {

      const directoryPath = path.join(__dirname, '../SavedData/');
      const projects = await readDataFromDirectory(directoryPath);
      // Organize the data into the desired structure
      const organizedProjects = {};
      for (const project of projects) {
        organizedProjects[project.name] = {
          pages: {},
        };
  
        for (const page of project.pagesData) {
          organizedProjects[project.name].pages[page.name] = page.widgetsData;
        }
      }
      console.log(organizedProjects["Project1"]["pages"]["page2"])
      return { success: true, projects: organizedProjects };
    } catch (error) {
      console.error('Error:', error);
      return { error };
    }
  });
  
  async function readDataFromDirectory(directoryPath) {
    const projects = await fs.promises.readdir(directoryPath);
    const projectData = [];
  
    for (const project of projects) {
      if(project == ".DS_Store"){continue}
      const projectPath = path.join(directoryPath, project);
      const pages = await fs.promises.readdir(projectPath);
  
      const projectInfo = {
        name: project,
        pagesData: [],
      };
  
      for (const page of pages) {
        const pagePath = path.join(projectPath, page);
        const widgets = await fs.promises.readdir(pagePath);
  
        const pageInfo = {
          name: page,
          widgetsData: [],
        };
  
        for (const widget of widgets) {
          const widgetPath = path.join(pagePath, widget);
  
          // Ensure the file is a JSON file
          if (path.extname(widget) === '.json') {
            const data = await fs.promises.readFile(widgetPath, 'utf8');
            const jsonData = JSON.parse(data);
            pageInfo.widgetsData.push(jsonData);
          }
        }
  
        projectInfo.pagesData.push(pageInfo);
      }
      projectData.push(projectInfo);
    }
    return projectData;
  }

}
