import { TasksWidget } from "./tasks.js"

let widgets = [];
let widgetId = 0;

const idClassNamesTasks = ["taskBoard", "addTaskButton", "taskInput", "tasks", "taskList"]

function addWidget(type){
    if(type=="tasks"){
        addTasksWidget("Task", idClassNamesTasks)
    }
}

function addTasksWidget(name, idClassNamesTasks) {
    const widgetsContainer = document.querySelector(".widgets");
    const widget = document.createElement('div');
    widget.className = 'widget';
    widget.id = `tasks${widgetId}`
    widget.innerHTML = `
        <div class="title-bar">
            <div class="title">
                <span contenteditable="true" class="titleText">${name} ${widgetId}</span>
            </div>
            <div class="buttons">
                <button class="close-button" onclick="closeWindow('${widget.id}')">✕</button>
            </div>
        </div>
        <div class="${idClassNamesTasks[0]}">
            <button id="${idClassNamesTasks[1]}" type="button">Add</button>
            <input placeholder="Task" id="${idClassNamesTasks[2]}">
        </div>
        <div class="${idClassNamesTasks[3]}">
            <div id="${idClassNamesTasks[4]}"></div>
        </div>
    `;
    widgetsContainer.appendChild(widget);
    new TasksWidget(widgetId); // Create a new TasksWidget instance
    widgetId++;
}

addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("addWidgetButton").addEventListener("click", function() {
        addWidget("tasks")
    });
});