const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
} = require("electron");
const path = require("path");
const isMac = process.platform === "darwin";
const fs = require("fs");
const utils = require("./Utils/utils")

let mainWindow = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}
async function setupMainMenu() {
  // First, define the menu template
  const template = [
    {
      label: app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "File",
      submenu: [
        {
          label: "New Project",
          role: "New",
          accelerator: "Shift+CmdOrCtrl+N",
          click: () => {
            mainWindow.webContents.send("newProject");
          },
        },
        {
          label: "New Page",
          role: "New",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            mainWindow.webContents.send("newPage");
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" }, // Fixed "past" to "paste"
        { role: "reload" },
        {
          role: "save",
          label: "Save",
          accelerator: "CmdOrCtrl+S",
          click: () => {
            mainWindow.webContents.send("savePage");
          },
        },
      ],
    },
    {
      label: "View",
      submenu: [{ role: "toggledevtools", label:"Toggle Developer Tools", accelerator: "CmdOrCtrl+I" }],
    },
  ];

  // Build the menu from the template
  const menu = Menu.buildFromTemplate(template);

   Menu.setApplicationMenu(menu);
}


const createWindow = () => {
  // Create the browser window.
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
  mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  handleCommunication();
  setupMainMenu();
};

// This method will be called when Electron has finished initialization and is ready to create browser windows.
app.on("ready", () => {
  createWindow();
  
    
  const sourceDirectory = path.join(__dirname, '../ExampleSavedData');
  const targetDirectory = path.join(app.getPath("userData") + "/SavedData");
  if (!fs.existsSync(path.join(app.getPath("userData"), "/SavedData"))) {
    copyDirectory(sourceDirectory, targetDirectory);
    console.log('Directory contents copied successfully!');
  }
  console.log(app.getPath("appData"))
  
  // if (!fs.existsSync(path.join(app.getPath("userData"), "/SavedData/"))) {
  //   // If it doesn't exist, create it
  //   fs.mkdir(path.join(app.getPath("userData"), "/SavedData/"), (err) => {
  //     if (err) {
  //       console.error("Error creating main directory for saved data:", err);
  //     } else {
  //     }
  //   });
  // } else {
  // }

  // order.json file
  // if (!fs.existsSync(path.join(app.getPath("userData"), "/SavedData/order.json"))) {
  //   // If it doesn't exist, create the file with the provided content
  //   fs.promises.writeFile(path.join(app.getPath("userData"), "/SavedData/order.json"), "{}");
  //   console.log(`File '${path.join(app.getPath("userData"), "/SavedData/order.json")}' created successfully.`);
  // } else {
  // }
});

// Quit when all windows are closed, except on macOS.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const handleCommunication = () => {
  ipcMain.removeHandler("saveData");
  ipcMain.removeHandler("restoreData");
  ipcMain.handle(
    "saveData",
    async (
      event,
      projectName,
      pageName,
      creating,
      data = null,
      name = null
    ) => {
      try {
        if (creating) {
          if (pageName == false) {
            utils.createDirectory(
              path.join(app.getPath("userData"), "/SavedData"),
              projectName
            );
          } else {
            utils.createDirectory(
              path.join(app.getPath("userData"), "/SavedData/" + projectName),
              pageName
            );
          }
        } else {
          const filePath = path.join(
            app.getPath("userData"),
            `/SavedData/${projectName}/${pageName}/${name}.json`
          ); // Set your desired file path here
          await fs.promises.writeFile(filePath, data, "utf8");
        }

        return { success: true };
      } catch (error) {
        return { error };
      }
    }
  );

  ipcMain.handle("getWidgetData", async () => {
    try {
      const directoryPath = path.join(__dirname, "../WidgetData/");
      const files = await fs.promises.readdir(directoryPath);

      const filesData = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(directoryPath, file);
          const data = await fs.promises.readFile(filePath, "utf8");
          return JSON.parse(data);
        })
      );

      return { success: true, filesData: filesData };
    } catch (error) {
      console.error("Error:", error);
      return { error };
    }
  });

  ipcMain.handle("restoreData", async () => {
    try {
      const directoryPath = path.join(app.getPath("userData"), "/SavedData/");
      const projects = await utils.readDataFromDirectory(directoryPath);

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
      return { success: true, projects: organizedProjects };
    } catch (error) {
      console.error("Error:", error);
      return { error };
    }
  });

  ipcMain.handle("getOrder", async () => {
    const filePath = path.join(app.getPath("userData"), "/SavedData/order.json");
    const data = await fs.promises.readFile(filePath, "utf8");
    return JSON.parse(data);
  })

  ipcMain.handle("saveOrder", async(event, content) =>{
    const filePath = path.join(app.getPath("userData"), "/SavedData/order.json");
    await fs.promises.writeFile(filePath, JSON.stringify(content), "utf8");
  })

};


function copyDirectory(sourceDir, targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  const files = fs.readdirSync(sourceDir);

  files.forEach((file) => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}