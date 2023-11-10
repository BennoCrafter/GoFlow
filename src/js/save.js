import { widgets } from "./configureWidgets.js";

window.electronAPI.onSavePage(() => {
  for (let w of widgets) {
    w.saveData();
  }
});

addEventListener("beforeunload", (event) => {
  for (let w of widgets) {
    w.saveData();
  }
});
