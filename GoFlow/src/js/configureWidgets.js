import { TasksWidget } from "./Widgets/tasks.js"
import { IncrementalGoalWidget } from "./Widgets/incrementalGoal.js"

let widgets = [];
let widgetId = 0;


const restoreData = async () => {
    try {
        const result = await window.electronAPI.restoreData();

        if (result.success) {
            for (const widget of result.filesData) {
                if (widget.type === "tasks") {
                    addTasksWidget(widget.title, widget, widget.widgetId)
                }else if(widget.type == "incrementalGoal"){
                    console.log("tets")
                    addIncrementalGoal("My Goal", widget.goalName, widget, widget.widgetId)
                }
                
            }
        } else {
            console.error("Data restore failed:", result.error);
        }
    } catch (error) {
        console.error("Error while restoring data:", error);
    }
};

function addWidget(type){
    console.log(type)
    if(type=="addWidgetTasks"){
        addTasksWidget("Task")
    }else if(type=="addWidgetIncrementalGoal"){
        addIncrementalGoal("My Goal", "Enter Goal")
    }
}


function addTasksWidget(title, data="new", wId=widgetId) {
    const widgetsContainer = document.querySelector(".widgets");
    const widget = document.createElement('div');
    widget.className = 'widget';
    widget.id = `tasks${wId}`
    widget.innerHTML = `
        <div class="title-bar">
            <span contenteditable="true" class="titleText">${title} ${wId}</span>
        </div>  
        </div>
        <div class="taskBoard">
            <button id="addTaskButton" type="button">Add</button>
            <input placeholder="Task" id="taskInput">
        </div>
        <div class="tasks">
            <div id="taskList"></div>
        </div>
    `;
    widgetsContainer.appendChild(widget);
    if(data=="new"){
        widgets.push(new TasksWidget(widgetId))
    }else{
        widgets.push(new TasksWidget(data.widgetId, data.title, data.tasks, data.xPos, data.yPos)); // Create a new TasksWidget instance
    }
    widgetId++;
}

function addIncrementalGoal(name, data="new", wId=widgetId){
    const widgetsContainer = document.querySelector(".widgets");
    const widget = document.createElement('div');
    widget.className = 'widget';
    widget.id = `incrementalGoal${wId}`
    widget.innerHTML = `
        <div class="title-bar">
            <span contenteditable="true" class="titleText">${name} ${wId}</span>
        </div>  
        </div>
        <div class="incrementalGoalWindow">
            <p id="reward"> </p>
            <span contenteditable="true" id="incrementalGoalName">${data.goalName}</span>
            <button id="increaseGoal" type="button">+</button>
            <p id="incrementalGoalStreak">Streak: 0<p>
        </div>
    `; 
    widgetsContainer.appendChild(widget);
    if(data=="new"){
        widgets.push(new IncrementalGoalWidget(widgetId))
    }else{
        widgets.push(new IncrementalGoalWidget(data.widgetId, data.goalName, data.lastDateIncreased, data.streak, data.xPos, data.yPos, data.title));
    }
    widgetId++;
}


// addEventListener("DOMContentLoaded", (event) => {
//     document.getElementById("addWidgetButton").addEventListener("click", function() {
//         addWidget("tasks")
//     });
// });

addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("saveData").addEventListener("click", function() {
        for (let w of widgets){
            w.saveData()
        }
    });
});

addEventListener("beforeunload", (event) => {
    for (let w of widgets){
        w.saveData()
    }   
});

restoreData();


const addButton = document.getElementById("addWidgetButton");
const menu = document.querySelector(".widgetButtonsMenu");

addButton.addEventListener("click", function() {
  if (menu.style.display === "none" || menu.style.display === "") {
    menu.style.display = "block";
  } else {
    menu.style.display = "none";
  }
});

document.addEventListener("click", function(event) {
  if (!menu.contains(event.target) && event.target !== addButton) {
    menu.style.display = "none";
  }else if(menu.contains(event.target) && event.target !== addButton){
    menu.style.display = "none";
    addWidget(event.target.id)
  }
});