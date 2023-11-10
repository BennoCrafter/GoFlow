import { TasksWidget } from "./Widgets/tasks.js"
import { IncrementalGoalWidget } from "./Widgets/incrementalGoal.js"
import { TextBox } from "./Widgets/textBox.js";
import { MediaWidget } from "./Widgets/media.js";
import { WeatherWidget } from "./Widgets/weather.js";
import { CalendarWidget } from "./Widgets/calendar.js";


import {currentProject, currentProjectPage} from "./manageOrder.js"
import { rePosWidgets } from "./rePosWidgets.js";

export let widgets = [];
let widgetData = {};

let projectData;
// call rePosWidgets functiom on resizing window
window.onresize = rePosWidgets

// todo: do it extra file
const exampleData = {xPos: "0px", yPos: "0px",anchorX: ["left","0px"], anchorY:["top","0px"], title: "Title", project: currentProject, page: currentProjectPage}
const titleHtml = `        
<div class="title-bar">
    <span contenteditable="true" class="titleText">title</span>
</div>  `;

export const restoreData = async () => {
    try {
        const result = await window.electronAPI.restoreData();

        if (result.success) {
            projectData = {... result}
        } else {
            console.error("Data restore failed:", result.error);
        }
    } catch (error) {
        console.error("Error while restoring data:", error);
    }
};

export async function loadPage(){
    document.querySelector(".widgets").innerHTML = ""
    for (const widget of projectData.projects[currentProject]["pages"][currentProjectPage]) {
        spawnWidget(widgetData[widget.data.type]["html"], widget.uniqueWidgetData, widget.widgetId, widget.data.type, widget.data)
    } 
    rePosWidgets()
}

const loadWidgetData = async () =>{
    try {
        const result = await window.electronAPI.getWidgetData();

        if (result.success) {
            for (const wD of result.filesData) {
                widgetData[wD.type] = wD;        
            }
        } else {
            console.error("Data restore failed:", result.error);
        }
    } catch (error) {
        console.error("Error while restoring data:", error);
    }
    
    await restoreData()
    await loadPage()
}

export function addWidget(type){
    const exampleDataExtended = {...exampleData, ...{type: type, page: currentProjectPage, project: currentProject}}
    spawnWidget(widgetData[type]["html"], {... widgetData[type]["uniqueWidgetData"]}, new Date().getTime(), type, {... exampleDataExtended})
}


function spawnWidget(html, uniqueWidgetData, wId, wType, data){
    const widgetsContainer = document.querySelector(".widgets");
    const widget = document.createElement('div');
    widget.className = 'widget';
    widget.id = `${wType}-${wId}`
    widget.innerHTML = titleHtml + html
    widgetsContainer.appendChild(widget);
    if(wType=="tasks"){
        widgets.push(new TasksWidget(wId, data, uniqueWidgetData))
    }else if(wType== "incrementalGoal"){
        widgets.push(new IncrementalGoalWidget(wId, data, uniqueWidgetData))
    }else if(wType=="textBox"){
        widgets.push(new TextBox(wId, data, uniqueWidgetData))
    }else if(wType=="media"){
        widgets.push(new MediaWidget(wId, data, uniqueWidgetData))
    }else if(wType=="weather"){
        widgets.push(new WeatherWidget(wId, data, uniqueWidgetData))
    }else if(wType=="calendar"){
        widgets.push(new CalendarWidget(wId, data, uniqueWidgetData))
    }

}

loadWidgetData();
