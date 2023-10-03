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
                    addTasksWidget("Task", widget, widget.widgetId)
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
        addIncrementalGoal("My Goal", "do 10 push ups")
    }
}

function addTasksWidget(name, mode="new", wId=widgetId) {
    const widgetsContainer = document.querySelector(".widgets");
    const widget = document.createElement('div');
    widget.className = 'widget';
    widget.id = `tasks${wId}`
    widget.innerHTML = `
        <div class="title-bar">
            <span contenteditable="true" class="titleText">${name} ${wId}</span>
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
    if(mode=="new"){
        widgets.push(new TasksWidget(widgetId))
    }else{
        widgets.push(new TasksWidget(mode.widgetId, mode.title, mode.tasks, mode.xPos, mode.yPos)); // Create a new TasksWidget instance
    }
    widgetId++;
}

function addIncrementalGoal(name, incrementalGoalName, mode="new", wId=widgetId){
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
            <p id="incrementalGoalName">${incrementalGoalName}</p>
            <button id="increaseGoal" type="button">+</button>
            <p id="incrementalGoalStreak">Streak: 0<p>
        </div>
    `; 
    widgetsContainer.appendChild(widget);
    if(mode=="new"){
        widgets.push(new IncrementalGoalWidget(widgetId))
    }else{
        widgets.push(new IncrementalGoalWidget(mode.widgetId, mode.goalName, mode.lastDateIncreased, mode.streak, mode.xPos, mode.yPos, mode.title));
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
