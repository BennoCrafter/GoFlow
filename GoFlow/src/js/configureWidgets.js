import { TasksWidget } from "./Widgets/tasks.js"
import { IncrementalGoalWidget } from "./Widgets/incrementalGoal.js"

let widgets = [];
let widgetId = 0;

window.onresize = rePosWidgets

const restoreData = async () => {
    try {
        const result = await window.electronAPI.restoreData();

        if (result.success) {
            for (const widget of result.filesData) {
                if (widget.type === "tasks") {
                    addTasksWidget(widget.title, widget.widgetId, widget)
                }else if(widget.type == "incrementalGoal"){
                    addIncrementalGoal(widget.title, widget.widgetId, widget.goalName, widget)
                }
                
            }
        } else {
            console.error("Data restore failed:", result.error);
        }
    } catch (error) {
        console.error("Error while restoring data:", error);
    }
    rePosWidgets()
};

function addWidget(type){
    if(type=="addWidgetTasks"){
        addTasksWidget()
    }else if(type=="addWidgetIncrementalGoal"){
        addIncrementalGoal()
    }else if(type=="addWidgetQuote"){
        
    }
}


function addTasksWidget(title="New Widget", wId=widgetId, data=null) {
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
    if(data==null){
        widgets.push(new TasksWidget(wId))
    }else{
        widgets.push(new TasksWidget(data.widgetId, data.title, data.type, data.tasks, data.xPos, data.yPos, data.anchorX, data.anchorY)); // Create a new TasksWidget instance
    }
    widgetId++;
}

function addIncrementalGoal(title="New Widget", wId=widgetId, goalName="enter goal", data=null){
    const widgetsContainer = document.querySelector(".widgets");
    const widget = document.createElement('div');
    widget.className = 'widget';
    widget.id = `incrementalGoal${wId}`
    widget.innerHTML = `
        <div class="title-bar">
            <span contenteditable="true" class="titleText">${title} ${wId}</span>
        </div>  
        </div>
        <div class="incrementalGoalWindow">
            <p id="reward"> </p>
            <span contenteditable="true" id="incrementalGoalName">${goalName}</span>
            <button id="increaseGoal" type="button">+</button>
            <p id="incrementalGoalStreak">Streak: 0<p>
        </div>
    `; 
    widgetsContainer.appendChild(widget);
    if(data==null){
        console.log("new wi")
        widgets.push(new IncrementalGoalWidget(widgetId=wId))
    }else{
        widgets.push(new IncrementalGoalWidget(data.widgetId, data.title, data.type, data.goalName, data.lastDateIncreased, data.streak, data.xPos, data.yPos, data.anchorX, data.anchorY));
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

function rePosWidgets(){
    let width = window.innerWidth
    let height = window.innerHeight
    for (let w of widgets) {
        const anchorX = w.anchorX;
        const anchorY = w.anchorY;
        let newXPos;
        let newYPos;
      
        // rePos x
        if (anchorX[0] == "right") {
            newXPos = width - parseInt(w.width) - parseInt(anchorX[1]);
        } else if (anchorX[0] == "left") {
            newXPos = parseInt(anchorX[1]);
        }
    
        // rePos y
        if (anchorY[0] == "bottom") {
            newYPos = height - parseInt(w.height) - parseInt(anchorY[1]);
        } else if (anchorY[0] == "top") {
            newYPos = parseInt(anchorY[1]);
        }
    
      
        w.xPos = newXPos + "px";
        w.yPos = newYPos + "px";
        w.updatePos();
      }
      
}
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