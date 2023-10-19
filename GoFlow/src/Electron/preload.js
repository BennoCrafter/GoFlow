const { contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveData(data, name, projectName, pageName) {
    return ipcRenderer.invoke("saveData", data, name, projectName, pageName);
  },
  restoreData() {
    return ipcRenderer.invoke("restoreData");
  },
  getWidgetData(){
    return ipcRenderer.invoke("getWidgetData");
  },
  onNewProject: (cb) => {
    ipcRenderer.on('newProject', (event, newProjectName) => cb(newProjectName));
  }
});
