
export class TasksWidget {
    constructor(widgetId) {
        this.widgetId = widgetId;
        this.tasks = {};
        this.id = 0;
        this.type = "tasks"
        this.title = "Task" + this.widgetId
        this.widgetPath = document.getElementById(`tasks${this.widgetId}`);
        this.taskInput = this.widgetPath.querySelector("#taskInput");
        this.taskList = this.widgetPath.querySelector("#taskList");

        this.editTaskText = this.editTaskText.bind(this); // Bind the editTaskText method to the instance
        this.saveTitle = this.saveTitle.bind(this); // Bind the saveTitle method to the instance
        this.initializeListeners();
    }

    saveData = () => {
        window.electronAPI.saveData(JSON.stringify("testt hello world pllss"));
      };
    restoreData = async () => {
        // const result = await window.electronAPI.restoreData();
      
        // if (result.success) {
        //   rowData = JSON.parse(result.data);
        //   gridOptions.api.setRowData(rowData);
        // }
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
        this.taskList.innerHTML = "";
        Object.entries(this.tasks).forEach(([taskId, task]) => {
            const div = document.createElement("div");
            div.className = "task";
            div.id = `task${taskId}`;
            div.innerHTML = `
                <input type="checkbox" class="taskCompletion">
                <span contenteditable="${!task.completed}" class="taskText">${task.text}</span>
            `;
            this.taskList.appendChild(div);

            const toggleCompletion = div.querySelector(".taskCompletion");
            toggleCompletion.addEventListener("click", () => this.toggleTaskCompletion(taskId));

            const editTask = div.querySelector(".taskText");
            editTask.addEventListener("click", () => this.editTaskText(taskId, editTask));
            
            const saveBtn = document.getElementById("saveData");
            const restoreBtn = document.getElementById("restoreData");
            saveBtn.addEventListener("click", this.saveData);
            restoreBtn.addEventListener("click", this.restoreData);
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
