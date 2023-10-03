export class IncrementalGoalWidget {
    constructor(widgetId, goalName = "enter goal", lastDateIncreased=null, streak = 0, xPos="0px", yPos = "0px", title="Goal") {
        this.widgetId = widgetId;
        this.goalName = goalName;
        this.streak = streak;
        this.xPos = xPos;
        this.yPos = yPos;
        this.title = title
        this.type = "incrementalGoal";
        this.lastDateIncreased = lastDateIncreased;
        console.log("xx", this.lastDateIncreased)
        this.widgetPath = document.getElementById(`incrementalGoal${this.widgetId}`);
        this.widgetPath.style.left = this.xPos
        this.widgetPath.style.top = this.yPos   
        this.saveTitle = this.saveTitle.bind(this); // Bind the saveTitle method to the instance
        this.loadEventListener();
        this.checkStreak()
        this.widgetPath.querySelector(".titleText").textContent = this.title;

    }
      
    increaseGoal() {
      if (this.canIncrease()) {
        this.lastDateIncreased = new Date().getTime();
        this.streak++;
  
        console.log(`Goal increased! Current streak: ${this.streak}`);
        this.updateText();
        this.saveData();
      } else {
        console.log("Goal already increased today.");
      }
    }
  
    canIncrease() {
      if (this.lastDateIncreased==null) {
        console.log("dsdsdd", this.lastDateIncreased)
        return true; // If lastDateIncreased is not set, allow increasing
      }
  
      // Check if the last increment was more than 24 hours ago
      const currentDate = new Date().getTime();
      const timeDifference = currentDate - this.lastDateIncreased;
      if (timeDifference >= 24 * 60 * 60 * 1000 && timeDifference <= 2*(24 * 60 * 60 * 1000)){
        // passed 24 hours and under 48 hours
        return true;
      }else if(timeDifference >= 2*(24 * 60 * 60 * 1000)){
        // passed over 48 hours (streak reset)
        this.streak = 0;
        this.saveData()
        this.updateText()
        this.lastDateIncreased = null; // set it to default
        console.log("lost streak")
        return false;
      }else{
        // doesnt passed 24 hours
        return false;
      }
    }
  
    saveData() {
      this.xPos = this.widgetPath.style.left;
      this.yPos = this.widgetPath.style.top;
      const data = {
        widgetId: this.widgetId,
        goalName: this.goalName,
        streak: this.streak,
        xPos: this.xPos,
        yPos: this.yPos,
        lastDateIncreased: this.lastDateIncreased,
        type: this.type,
        title: this.title,
      };
  
      // Assuming you have an external API for saving data (window.electronAPI.saveData),
      // you can call it here.
      window.electronAPI.saveData(JSON.stringify(data), "widget" + this.widgetId);
    }

    saveTitle() {
      const titleText = this.widgetPath.querySelector(".titleText");
      titleText.contentEditable = false;
      this.title = titleText.textContent.trim();
    }
    
    checkStreak(){
        this.canIncrease()
        this.saveData()
        this.updateText()
    }
  
    updateText() {
      this.widgetPath.querySelector(".incrementalGoalWindow").querySelector("#incrementalGoalStreak").textContent = "Streak: " + this.streak;
    }
  
    loadEventListener() {
      this.widgetPath.querySelector(".incrementalGoalWindow").querySelector("#increaseGoal").addEventListener("click", () => {
        this.increaseGoal();
      });

      this.widgetPath.querySelector(".titleText").addEventListener("click", () => {
        this.widgetPath.querySelector(".titleText").contentEditable = true;
        this.widgetPath.querySelector(".titleText").focus();
      });

      document.addEventListener("click", (event) => {
        if (event.target !== this.widgetPath.querySelector(".titleText")) {
            this.saveTitle();
        }
    });
    this.widgetPath.querySelector(".titleText").addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
          event.preventDefault(); // Prevent the default Enter key behavior (e.g., adding a new line)
          this.widgetPath.querySelector(".titleText").blur(); // Trigger the blur event to save the title
      }
  });
    }
  }
  