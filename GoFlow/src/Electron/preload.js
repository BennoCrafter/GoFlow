const { contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveData(projectName, pageName, isNewDir, data, name)  {
    return ipcRenderer.invoke("saveData", projectName, pageName, isNewDir, data, name);
  },
  restoreData() {
    return ipcRenderer.invoke("restoreData");
  },
  getWidgetData(){
    return ipcRenderer.invoke("getWidgetData");
  },
  onNewProject: (cb) => {
    ipcRenderer.on('newProject', (event, newProjectName) => cb(newProjectName));
  },
  onNewPage: (cb) => {
    ipcRenderer.on('newPage', (event) => cb());
  }  
});
