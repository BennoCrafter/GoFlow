const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  Menu,
  dialog,
} = require("electron");
const path = require("path");
const { constrainedMemory } = require("process");
const fs = require("fs").promises;
const fss = require("fs");
let mainWindow = null;

const isMac = process.platform === "darwin";
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

async function setupMainMenu() {
  // First, define the menu template
  const template = [
    ...(isMac
      ? [
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
        ]
      : []),
    {
      label: "File",
      submenu: [
        {
          label: "New Project",
          role: "New",
          click: () => {
            mainWindow.webContents.send("newProject");
          },
        },
        {
          label: "New Page",
          role: "New",
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
        { role: "save" },
      ],
    },
    {
      label: "View",
      submenu: [{ role: "toggledevtools" }],
    },
  ];

  // Build the menu from the template
  const menu = Menu.buildFromTemplate(template);

  // Set the application's default menu
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

  // Toggle open/close the DevTools.
  globalShortcut.register("CommandorControl+D", () => {
    if (mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.webContents.closeDevTools();
    } else {
      mainWindow.webContents.openDevTools();
    }
  });
  handleCommunication();
  setupMainMenu();
};

// This method will be called when Electron has finished initialization and is ready to create browser windows.
app.on("ready", () => {
  createWindow();

  if (!fss.existsSync(path.join(__dirname, "../SavedData/"))) {
    // If it doesn't exist, create it
    fss.mkdir(path.join(__dirname, "../SavedData/"), (err) => {
      if (err) {
        console.error("Error creating main directory for saved data:", err);
      } else {
      }
    });
  } else {
  }
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
      isNewDir,
      data = null,
      name = null
    ) => {
      try {
        if (isNewDir) {
          if (
            !fss.existsSync(path.join(__dirname, "../SavedData/" + projectName))
          ) {
            // If it doesn't exist, create it
            fss.mkdir(
              path.join(__dirname, "../SavedData/" + projectName),
              (err) => {
                if (err) {
                  console.error("Error creating directory:", err);
                } else {
                  console.log("Directory created successfully");
                }
              }
            );
          } else {
            console.log("Directory already exists");
          }
        } else {
          const filePath = path.join(
            __dirname,
            `../SavedData/${projectName}/${pageName}/${name}.json`
          ); // Set your desired file path here
          await fs.writeFile(filePath, data, "utf8");
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
      const files = await fs.readdir(directoryPath);

      const filesData = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(directoryPath, file);
          const data = await fs.readFile(filePath, "utf8");
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
      const directoryPath = path.join(__dirname, "../SavedData/");
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
      return { success: true, projects: organizedProjects };
    } catch (error) {
      console.error("Error:", error);
      return { error };
    }
  });

  async function readDataFromDirectory(directoryPath) {
    const projects = await fs.readdir(directoryPath);
    const projectData = [];

    for (const project of projects) {
      if (project == ".DS_Store") {
        continue;
      }
      const projectPath = path.join(directoryPath, project);
      const pages = await fs.readdir(projectPath);

      const projectInfo = {
        name: project,
        pagesData: [],
      };

      for (const page of pages) {
        const pagePath = path.join(projectPath, page);
        const widgets = await fs.readdir(pagePath);

        const pageInfo = {
          name: page,
          widgetsData: [],
        };

        for (const widget of widgets) {
          const widgetPath = path.join(pagePath, widget);

          // Ensure the file is a JSON file
          if (path.extname(widget) === ".json") {
            const data = await fs.readFile(widgetPath, "utf8");
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
};
