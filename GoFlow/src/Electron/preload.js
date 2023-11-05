const { contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveData(projectName, pageName, creating, data, name)  {
    return ipcRenderer.invoke("saveData", projectName, pageName, creating, data, name);
  },
  restoreData() {
    return ipcRenderer.invoke("restoreData");
  },
  getWidgetData(){
    return ipcRenderer.invoke("getWidgetData");
  },
  getOrder(){
    return ipcRenderer.invoke("getOrder");
  },
  saveOrder(content){
    return ipcRenderer.invoke("saveOrder", content)
  },
  onNewProject: (cb) => {
    ipcRenderer.on('newProject', (event) => cb());
  },
  onNewPage: (cb) => {
    ipcRenderer.on('newPage', (event) => cb());
  },
  onSavePage: (cb) => {
    ipcRenderer.on('savePage', (event) => cb());
  }  
});
