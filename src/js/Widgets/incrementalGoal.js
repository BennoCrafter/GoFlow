import { Widget } from "../widget.js";

export class IncrementalGoalWidget extends Widget {
  constructor(widgetId, data, uniqueWidgetData) {
    super(widgetId, data, uniqueWidgetData);

    this.data = data;
    this.uniqueWidgetData = uniqueWidgetData;

    this.loadEventListener();
    this.checkStreak();
    this.updateText();
  }

  increaseGoal() {
    if (this.canIncrease()) {
      this.uniqueWidgetData.lastDateIncreased = new Date().getTime();
      this.uniqueWidgetData.streak++;
      this.showReward();
      console.log(
        `Goal increased! Current streak: ${this.uniqueWidgetData.streak}`
      );
      this.updateText();
      this.saveData();
    } else {
      console.log("Goal already increased today.");
    }
  }

  canIncrease() {
    const { lastDateIncreased, streak } = this.uniqueWidgetData;
  
    if (!lastDateIncreased) {
      return true; // If lastDateIncreased is not set, allow increasing
    }
  
    const prediction = new Date(lastDateIncreased + 86400000);
    const currentDate = new Date();
  
    // Check if the last increment was on the same day
    if (
      prediction.getDate() === currentDate.getDate() &&
      prediction.getMonth() === currentDate.getMonth() &&
      prediction.getFullYear() === currentDate.getFullYear()
    ) {
      return true;
    } else {
      const timeDifference = currentDate - lastDateIncreased;
  
      if (timeDifference >= 2 * (24 * 60 * 60 * 1000)) {
        this.uniqueWidgetData.streak = 0;
        this.saveData();
        this.updateText();
        this.uniqueWidgetData.lastDateIncreased = null; // set it to default
        console.log("lost streak");
      }
      return false;
    }
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
      "Streak: " + this.uniqueWidgetData.streak;
    // update title
    this.widgetPath.querySelector(".titleText").textContent = this.data.title;
    // update goal name
    this.widgetPath
      .querySelector(".incrementalGoalWindow")
      .querySelector("#incrementalGoalName").textContent =
      this.uniqueWidgetData.goalName.trim();
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
        this.uniqueWidgetData.goalName = textSpan.textContent.trim();
        textSpan.contentEditable = false;
      }
    });

    this.saveData();
    this.updateText();
  }

  loadEventListener() {
    this.widgetPath
      .querySelector(".incrementalGoalWindow")
      .querySelector("#increaseGoal")
      .addEventListener("click", () => {
        this.increaseGoal();
      });
    this.widgetPath
      .querySelector(".incrementalGoalWindow")
      .querySelector("#incrementalGoalName")
      .addEventListener("click", () => this.editGoal());
  }
}
