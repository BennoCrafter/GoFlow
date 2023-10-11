const { contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveData(data, name) {
    return ipcRenderer.invoke("saveData", data, name);
  },
  restoreData() {
    return ipcRenderer.invoke("restoreData");
  },
  getWidgetData(){
    return ipcRenderer.invoke("getWidgetData");
  }
});
