export class Widget {
  constructor(
    widgetId,
    data,
    uniqueWidgetData,
  ) {
    this.widgetId = widgetId;
    this.data = data;
    this.uniqueWidgetData = uniqueWidgetData;
    this.widgetPath = document.getElementById(`${this.data.type}${widgetId}`);
    this.widgetPath.querySelector(".titleText").textContent = this.data.title;
    this.saveData()
    this.updatePos()
}

  updatePos() {
    
    this.widgetPath.style.left = this.data.xPos;
    this.widgetPath.style.top = this.data.yPos;
  }

  saveData() {
    this.data.xPos = this.widgetPath.style.left;
    this.data.yPos = this.widgetPath.style.top;

    const mergedData = {...{widgetId: this.widgetId}, ...{data: this.data}, ...{uniqueWidgetData: this.uniqueWidgetData}}

    // todo add possibillity to save it just so as file without any electron
    window.electronAPI.saveData(JSON.stringify(mergedData), "widget" + this.widgetId);
  }

  loadBaseEventListener() {

    this.widgetPath
      .querySelector(".titleText")
      .addEventListener("click", () => {
        this.widgetPath.querySelector(".titleText").contentEditable = true;
        this.widgetPath.querySelector(".titleText").focus();
      });

    document.addEventListener("click", (event) => {
      if (event.target !== this.widgetPath.querySelector(".titleText")) {
        this.saveTitle();
      }
    });

    this.widgetPath
      .querySelector(".titleText")
      .addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault(); // Prevent the default Enter key behavior (e.g., adding a new line)
          this.widgetPath.querySelector(".titleText").blur(); // Trigger the blur event to save the title
        }
      });

    this.widgetPath.addEventListener("click", (event) => {
      this.determineNewAnchors();
    });
  }

  determineNewAnchors() {
    this.data.xPos = this.widgetPath.style.left;
    this.data.yPos = this.widgetPath.style.top;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const rightXPos = parseInt(this.data.xPos) + parseInt(this.uniqueWidgetData.width) + "px";
    const bottomYPos = parseInt(this.data.yPos) + parseInt(this.uniqueWidgetData.height) + "px";

    // anchorX
    if (parseInt(this.data.xPos) > windowWidth / 2) {
      // Keep the widget on the right side of the screen
      this.data.anchorX = ["right", windowWidth - parseInt(rightXPos) + "px"];
    } else {
      // Keep the widget on the left side of the screen
      this.data.anchorX = ["left", this.data.xPos];
    }
    // anchorY
    if (parseInt(this.data.yPos) + parseInt(this.uniqueWidgetData.height) / 2 > windowHeight / 2) {
      // Keep the widget at the top of the screen
      this.data.anchorY = ["bottom", windowHeight - parseInt(bottomYPos) + "px"];
    } else {
      // Keep the widget at the bottom of the screen
      this.data.anchorY = ["top", this.data.yPos];
    }
    this.saveData();
  }

  saveTitle() {
    const titleText = this.widgetPath.querySelector(".titleText");
    titleText.contentEditable = false;
    this.data.title = titleText.textContent.trim();
}
}
