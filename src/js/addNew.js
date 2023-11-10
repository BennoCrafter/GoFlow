import { currentProject, order } from "./manageOrder.js";

const inputDialog = document.getElementById("inputDialog");
const inputField = document.getElementById("inputField");
const width = 300;

let mode;
// Add an event listener for the New Project button

window.electronAPI.onNewProject(() => {
  mode = "project";
  inputField.placeholder = `Enter ${mode} name`;
  inputDialog.querySelector("#submitButton").textContent = `Create new ${mode}`;
  setupInputDialog();
});

window.electronAPI.onNewPage(() => {
  mode = "page";
  inputField.placeholder = `Enter ${mode} name`;
  inputDialog.querySelector("#submitButton").textContent = `Create new ${mode}`;
  setupInputDialog();
});

// Handle Enter key press in the input field
inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    create();
  }
});
inputDialog.querySelector("#submitButton").onclick = function () {
  create();
};
// Close the menu when clicking outside
document.addEventListener("click", (event) => {
  if (!inputDialog.contains(event.target)) {
    inputDialog.style.display = "none";
  }
});

function create() {
  // Process the project name input and close the menu
  const name = inputField.value;
  inputDialog.style.display = "none";
  if (mode == "project") {
    order[name] = []
    window.electronAPI.saveData(name, false, true, null, null);
  } else {
    order[currentProject].push(name);
    window.electronAPI.saveData(currentProject, name, true, null, null);
  }

  window.electronAPI.saveOrder(order)

  // Optionally, reset the input field
  // vt.sucess("Succesfull to create new Project", {
  //     title: "Sucess!",
  //     position: "top-left",
  // })
  inputField.value = "";
}

function setupInputDialog() {
  if (inputDialog.style.display === "block") {
    inputDialog.style.display = "none";
  } else {
    inputDialog.style.top = 100 + "px";
    inputDialog.style.left = window.innerWidth / 2 - width / 2 + "px";
    inputDialog.style.display = "block";

    // Focus the input field when the menu is displayed
    inputField.focus();
  }
}
