import { addWidget } from "../configureWidgets.js";

const addButton = document.getElementById("addWidgetButton");
const menu = document.querySelector(".widgetButtonsMenu");

addButton.addEventListener("click", function () {
  if (menu.style.display === "none" || menu.style.display === "") {
    menu.style.display = "block";
  } else {
    menu.style.display = "none";
  }
});

document.addEventListener("click", function (event) {
  if (!menu.contains(event.target) && event.target !== addButton) {
    menu.style.display = "none";
  } else if (menu.contains(event.target) && event.target !== addButton) {
    menu.style.display = "none";
    addWidget(event.target.getAttribute("data-widgetType"));
  }
});
