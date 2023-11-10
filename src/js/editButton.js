import { widgets } from "./configureWidgets.js";

const editButton = document.getElementById("editButton")
let editMode = false;

editButton.onclick = function(){
    console.log(widgets)
    editMode != editMode;

    if(editMode==false){
        for (let w of widgets){
                w.enterEditMode()
        }
    }

}

export {editMode}