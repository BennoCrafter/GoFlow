const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveData(data) {
    return ipcRenderer.invoke("saveData", data);
  },
  restoreData() {
    return ipcRenderer.invoke("restoreData");
  },
});

