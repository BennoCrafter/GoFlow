import { Widget } from "../widget.js";

export class TasksWidget extends Widget {
  constructor(
    widgetId,
    data,
    uniqueWidgetData
  ) {
    super(widgetId, data, uniqueWidgetData);
    this.tasks = uniqueWidgetData.tasks;
    this.id = Object.keys(this.tasks).length;

    this.taskInput = this.widgetPath
      .querySelector(".taskBoard")
      .querySelector("#taskInput");
    this.taskList = this.widgetPath.querySelector("#taskList");

    this.loadEventListeners();
    this.displayTasks();
  }

  loadEventListeners() {
    this.taskInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        this.addTaskToWidget();
      }
    });

    const addButton = this.widgetPath.querySelector("#addTaskButton");
    addButton.addEventListener("click", () => this.addTaskToWidget());
  }
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
            <span contenteditable="${!task.completed}" class="taskText">${
        task.text
      }</span>
        `;
      this.taskList.insertBefore(div, this.taskList.firstChild);

      const toggleCompletion = div.querySelector(".taskCompletion");
      toggleCompletion.addEventListener("click", () =>
        this.toggleTaskCompletion(taskId)
      );

      const editTask = div.querySelector(".taskText");
      editTask.addEventListener("click", () =>
        this.editTaskText(taskId, editTask)
      );
    });
  }

  toggleTaskCompletion(taskId) {
    const e = document
      .querySelector(".widgets")
      .querySelector(`#${this.data.type}${this.widgetId}`)
      .querySelector(".tasks")
      .querySelector("#taskList")
      .querySelector(`#task${taskId}`);
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
}