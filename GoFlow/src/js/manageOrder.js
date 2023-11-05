import {restoreData, loadPage} from "./configureWidgets.js"

export let order = await window.electronAPI.getOrder()
let index = 0
export let currentProject = "test"
export let currentProjectPage = order[currentProject][index]

document.addEventListener("keydown", async function(event) {
    if(event.target.id == "body"){
        await restoreData()
    if (event.key === "ArrowLeft") {
        if(index+1 <= order[currentProject]){
            index++;
            currentProjectPage = order[currentProject][index]
            loadPage()
        }
        // Do something for the left arrow key press
    } else if (event.key === "ArrowRight") {
        if(index>=0){
            index --;
            currentProjectPage = order[currentProject][index]     
            loadPage()
        }
    }
    }
  });

