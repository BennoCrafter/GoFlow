import {restoreData, loadPage} from "./configureWidgets.js"

export let order = await window.electronAPI.getOrder()
let index = 0
export let currentProject = "MyProject"
export let currentProjectPage = order[currentProject][index]

document.addEventListener("keydown", async function(event) {
    if(event.target.id == "body"){
    if (event.key === "ArrowRight") {
        await restoreData()
        if(index+1 <= order[currentProject].length){
            index++;
            currentProjectPage = order[currentProject][index]
            loadPage()
        }
    } else if (event.key === "ArrowLeft") {
        await restoreData()
        if(index>0){
            index --;
            currentProjectPage = order[currentProject][index]     
            loadPage()
        }
    }
    }
  });

