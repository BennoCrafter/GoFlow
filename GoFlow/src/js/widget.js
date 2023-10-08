export class Widget {
  constructor(
    widgetId,
    title="Widget",
    type="not def",
    xPos = "0px",
    yPos = "0px",
    anchorX = ["left", "0px"],
    anchorY = ["top", "0px"],
  ) {
    this.widgetId = widgetId;
    this.title = title;
    this.type = type;

    this.xPos = xPos;
    this.yPos = yPos;
    this.anchorX = anchorX;
    this.anchorY = anchorY;
    this.widgetPath = document.getElementById(`${type}${widgetId}`);
    this.widgetPath.querySelector(".titleText").textContent = this.title;
    this.updatePos()
}

  updatePos() {
    this.widgetPath.style.left = this.xPos;
    this.widgetPath.style.top = this.yPos;
  }

  saveData() {
    this.xPos = this.widgetPath.style.left;
    this.yPos = this.widgetPath.style.top;
    const data = {
      widgetId: this.widgetId,
      type: this.type,
      title: this.title,
      xPos: this.xPos,
      yPos: this.yPos,
      anchorX: this.anchorX,
      anchorY: this.anchorY,
    };
    let specialData;
    if(this.type=="incrementalGoal"){
        specialData = {goalName:this.goalName, streak: this.streak, lastDateIncreased: this.lastDateIncreased}
    }else if(this.type=="tasks"){
        specialData = {tasks: this.tasks}
    }

    const mergedData = {...data, ...specialData}
    console.log(mergedData)

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
    this.xPos = this.widgetPath.style.left;
    this.yPos = this.widgetPath.style.top;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const rightXPos = parseInt(this.xPos) + parseInt(this.width) + "px";
    const bottomYPos = parseInt(this.yPos) + parseInt(this.height) + "px";

    // anchorX
    if (parseInt(this.xPos) > windowWidth / 2) {
      // Keep the widget on the right side of the screen
      this.anchorX = ["right", windowWidth - parseInt(rightXPos) + "px"];
    } else {
      // Keep the widget on the left side of the screen
      this.anchorX = ["left", this.xPos];
    }
    // anchorY
    if (parseInt(this.yPos) + parseInt(this.height) / 2 > windowHeight / 2) {
      // Keep the widget at the top of the screen
      this.anchorY = ["bottom", windowHeight - parseInt(bottomYPos) + "px"];
    } else {
      // Keep the widget at the bottom of the screen
      this.anchorY = ["top", this.yPos];
    }
    this.saveData();
  }

  saveTitle() {
    console.log("lel")
    const titleText = this.widgetPath.querySelector(".titleText");
    titleText.contentEditable = false;
    this.title = titleText.textContent.trim();
}
}
