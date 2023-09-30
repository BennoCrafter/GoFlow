class RestoreWidgets{
    constructor(){

    }

    restoreData = async () => {
        const filesData = await window.electronAPI.restoreData();
      
        if (result.success) {
            console.log(filesData)
        }
      };
}


