
export class TasksWidget {
    constructor(widgetId, title="Task", tasks={}, xPos=0, yPos=0, anchorX=["left", "0px"], anchorY=["top", "0px"]) {
        this.widgetId = widgetId;
        this.tasks = tasks;
        this.id = Object.keys(this.tasks).length;
        this.type = "tasks"
        this.title = title
        this.xPos = xPos
        this.yPos = yPos
        this.widgetPath = document.getElementById(`tasks${this.widgetId}`);
        this.taskInput = this.widgetPath.querySelector(".taskBoard").querySelector("#taskInput");
        this.taskList = this.widgetPath.querySelector("#taskList");

        this.editTaskText = this.editTaskText.bind(this); // Bind the editTaskText method to the instance
        this.saveTitle = this.saveTitle.bind(this); // Bind the saveTitle method to the instance
        this.initializeListeners();
        this.movePos()
        this.displayTasks()
        this.widgetPath.querySelector(".titleText").textContent = this.title;


    }
    movePos(){
        this.widgetPath.style.left = this.xPos
        this.widgetPath.style.top = this.yPos          
    }
    saveData() {
        this.xPos = this.widgetPath.style.left;
        this.yPos = this.widgetPath.style.top;
        let data = {type: this.type, widgetId: this.widgetId, title: this.title, tasks: this.tasks, xPos: this.xPos, yPos: this.yPos}
        console.log(data)
        window.electronAPI.saveData(JSON.stringify(data), "widget" + this.widgetId);
      };

    addTaskToWidget() {
        const todoName = this.taskInput.value.trim();

        if (todoName === "") {
            return; // Don't add empty tasks
        }

        this.tasks[this.id] = { text: todoName, completed: false };
        this.id++;
        this.displayTasks();
        this.taskInput.value = ""; // Clear the input field
    }

    displayTasks() {
        console.log(this.tasks)
        this.taskList.innerHTML = "";
        Object.entries(this.tasks).forEach(([taskId, task]) => {
            const div = document.createElement("div");
            div.className = "task";
            div.id = `task${taskId}`;
            div.innerHTML = `
                <input type="checkbox" class="taskCompletion">
                <span contenteditable="${!task.completed}" class="taskText">${task.text}</span>
            `;
            this.taskList.insertBefore(div, this.taskList.firstChild);

            const toggleCompletion = div.querySelector(".taskCompletion");
            toggleCompletion.addEventListener("click", () => this.toggleTaskCompletion(taskId));

            const editTask = div.querySelector(".taskText");
            editTask.addEventListener("click", () => this.editTaskText(taskId, editTask));
        });
    }

    toggleTaskCompletion(taskId) {
        const e = document.querySelector(".widgets").querySelector(`#${this.type}${this.widgetId}`).querySelector(".tasks").querySelector("#taskList").querySelector(`#task${taskId}`)
        e.classList.add("fadeOut");
        setTimeout(() => {
            e.remove();
            delete this.tasks[taskId];
            this.displayTasks();
        }, 1000);
    }

    editTaskText(taskId, textSpan) {
        textSpan.contentEditable = true;
        textSpan.focus();
        textSpan.addEventListener("blur", () => {
            this.tasks[taskId].text = textSpan.textContent.trim();
            textSpan.contentEditable = false;
        });

        // Add an event listener to handle Enter key press for saving the edited task text
        textSpan.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevent the default Enter key behavior (e.g., adding a new line)
                textSpan.blur(); // Trigger the blur event to save the edited text
            }
        });
    }


    saveTitle() {
        const titleText = this.widgetPath.querySelector(".titleText");
        titleText.contentEditable = false;
        this.title = titleText.textContent.trim();
    }

    initializeListeners() {
        this.taskInput.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                this.addTaskToWidget();
            }
        });

        const addButton = this.widgetPath.querySelector("#addTaskButton");
        addButton.addEventListener("click", () => this.addTaskToWidget());

        const titleText = this.widgetPath.querySelector(".titleText");
        
        titleText.addEventListener("click", () => {
            titleText.contentEditable = true;
            titleText.focus();
        });

        // Add event listener for saving the title when pressing Enter
        titleText.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevent the default Enter key behavior (e.g., adding a new line)
                titleText.blur(); // Trigger the blur event to save the title
            }
        });

        // Add event listener for saving the title when clicking outside of the titleText element
        document.addEventListener("click", (event) => {
            if (event.target !== titleText) {
                this.saveTitle();
            }
        });
    }

}
