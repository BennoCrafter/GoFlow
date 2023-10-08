export class IncrementalGoalWidget {
  constructor(
    widgetId,
    title = "Goal",
    goalName = "enter goal",
    lastDateIncreased = null,
    streak = 0,
    xPos = "0px",
    yPos = "0px",
    anchorX = ["left", "0px"],
    anchorY = ["top", "0px"]
  ) {
    this.title = title;
    this.widgetId = widgetId;
    this.type = "incrementalGoal";
    this.widgetPath = document.getElementById(
      `incrementalGoal${this.widgetId}`
    );
    this.width = "270px";
    this.height = "180px";
    this.goalName = goalName;
    this.streak = streak;
    this.lastDateIncreased = lastDateIncreased;

    this.xPos = xPos;
    this.yPos = yPos;
    this.anchorX = anchorX;
    this.anchorY = anchorY;

    this.loadEventListener();
    this.checkStreak();
    this.updatePos()
  }

  increaseGoal() {
    if (this.canIncrease()) {
      this.lastDateIncreased = new Date().getTime();
      this.streak++;
      this.showReward();
      console.log(`Goal increased! Current streak: ${this.streak}`);
      this.updateText();
      this.saveData();
    } else {
      console.log("Goal already increased today.");
    }
  }

  canIncrease() {
    if (this.lastDateIncreased == null) {
      return true; // If lastDateIncreased is not set, allow increasing
    }

    // Check if the last increment was more than 24 hours ago
    const currentDate = new Date().getTime();
    const timeDifference = currentDate - this.lastDateIncreased;
    if (
      timeDifference >= 24 * 60 * 60 * 1000 &&
      timeDifference <= 2 * (24 * 60 * 60 * 1000)
    ) {
      // passed 24 hours and under 48 hours
      return true;
    } else if (timeDifference >= 2 * (24 * 60 * 60 * 1000)) {
      // passed over 48 hours (streak reset)
      this.streak = 0;
      this.saveData();
      this.updateText();
      this.lastDateIncreased = null; // set it to default
      console.log("lost streak");
      return false;
    } else {
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
      anchorX: this.anchorX,
      anchorY: this.anchorY,
      lastDateIncreased: this.lastDateIncreased,
      type: this.type,
      title: this.title,
    };

    // Assuming you have an external API for saving data (window.electronAPI.saveData),
    // you can call it here.
    window.electronAPI.saveData(JSON.stringify(data), "widget" + this.widgetId);
  }

  updatePos() {
    this.widgetPath.style.left = this.xPos;
    this.widgetPath.style.top = this.yPos;
  }
  saveTitle() {
    const titleText = this.widgetPath.querySelector(".titleText");
    titleText.contentEditable = false;
    this.title = titleText.textContent.trim();
  }

  checkStreak() {
    this.canIncrease();
    this.saveData();
    this.updateText();
  }

  updateText() {
    // update streak
    this.widgetPath
      .querySelector(".incrementalGoalWindow")
      .querySelector("#incrementalGoalStreak").textContent =
      "Streak: " + this.streak;
    // update title
    this.widgetPath.querySelector(".titleText").textContent = this.title;
    // update goal name
    this.widgetPath
      .querySelector(".incrementalGoalWindow")
      .querySelector("#incrementalGoalName").textContent = this.goalName.trim();
  }

  showReward() {
    const rewardElement = this.widgetPath
      .querySelector(".incrementalGoalWindow")
      .querySelector("#reward");
    const rewards = [
      "Congratulations! You're making great progress!",
      "Awesome job! Keep it up!",
      "You're on fire! Here's a virtual high-five! 🤟",
      "You're doing fantastic! Take a moment to celebrate!",
      "You're unstoppable! Keep pushing towards your goal!",
      "Impressive work! Keep the momentum going!",
      "You're a goal-crushing machine!",
      "Every step counts. Keep moving forward!",
      "You're a star! Keep shining bright!",
      "You're making it happen! Keep the positivity flowing!",
      "You're a goal-getter! Stay motivated!",
      "Outstanding effort! The sky is the limit!",
      "You're a champion! Keep setting and achieving!",
      "Incredible dedication! Keep up the good work!",
      "You're a goal-achieving ninja!",
      "You're making waves of progress!",
      "You're a goal-driven inspiration!",
      "Bravo! You're nailing your goals!",
      "You're a goal-achieving superstar!",
      "Amazing! Keep aiming for the stars!",
    ];

    const randomIndex = Math.floor(Math.random() * rewards.length);
    const rewardMessage = rewards[randomIndex];

    rewardElement.textContent = rewardMessage;
    rewardElement.style.transform =
      "translate(-50%, -50%) scale(1) rotate(5deg)";
    rewardElement.style.opacity = "1";

    setTimeout(() => {
      rewardElement.style.transform =
        "translate(-50%, -50%) scale(0) rotate(0deg)";
      rewardElement.style.opacity = "0";
    }, 3000); // Hide the reward message after 3 seconds
  }

  editGoal() {
    const textSpan = this.widgetPath
      .querySelector(".incrementalGoalWindow")
      .querySelector("#incrementalGoalName");
    textSpan.contentEditable = true;
    textSpan.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent the default Enter key behavior (e.g., adding a new line)
        this.goalName = textSpan.textContent.trim();
        textSpan.contentEditable = false;
      }
    });

    this.saveData();
    this.updateText();
  }
  loadEventListener() {
    this.saveTitle = this.saveTitle.bind(this);
    this.widgetPath
      .querySelector(".incrementalGoalWindow")
      .querySelector("#increaseGoal")
      .addEventListener("click", () => {
        this.increaseGoal();
      });

    this.widgetPath
      .querySelector(".titleText")
      .addEventListener("click", () => {
        this.widgetPath.querySelector(".titleText").contentEditable = true;
        this.widgetPath.querySelector(".titleText").focus();
      });

    this.widgetPath
      .querySelector(".incrementalGoalWindow")
      .querySelector("#incrementalGoalName")
      .addEventListener("click", () => this.editGoal());

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
    if (parseInt(this.yPos) + parseInt(this.height)/2 > windowHeight / 2) {
        // Keep the widget at the top of the screen
        this.anchorY = ["bottom", windowHeight - parseInt(bottomYPos) + "px"];
    } else {
        // Keep the widget at the bottom of the screen
        this.anchorY = ["top", this.yPos];
    }
    this.saveData()
  }
}
