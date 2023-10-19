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
    // Deliberately strip event as it includes `sender` (note: Not sure about that, I partly pasted it from somewhere)
    // Note: The first argument is always event, but you can have as many arguments as you like, one is enough for me.
    ipcRenderer.on('newProject', (event, newProjectName) => cb(newProjectName));
  }
});
