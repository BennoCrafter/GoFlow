import {restoreData, loadPage} from "./configureWidgets.js"

export let order = await window.electronAPI.getOrder()
let index = 0
export let currentProject = "MyProject"
export let currentProjectPage = order[currentProject][index]

document.addEventListener("keydown", async function(event) {
    if(event.target.id == "body"){
    if (event.key === "ArrowRight") {
        if(index+2 <= order[currentProject].length){
            await restoreData()
            index++;
            currentProjectPage = order[currentProject][index]
            loadPage()
        }
    } else if (event.key === "ArrowLeft") {
        if(index-1>=0){
            await restoreData()
            index --;
            currentProjectPage = order[currentProject][index]     
            loadPage()
        }
    }
    }
  });

