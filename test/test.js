function hasNewDayStarted(savedDate) {
    const currentDate = new Date();
    const savedDay = savedDate.getDate();
    const currentDay = currentDate.getDate();
    const savedHour = savedDate.getHours();
    const currentHour = currentDate.getHours();
  
    // Check if the day or hour has changed
    return (currentDay > savedDay) || (currentHour > savedHour && currentDay === savedDay);
  }
  
  // Example usage:
  const savedDate = new Date("2023-10-18T22:00:00"); // Replace with your saved date
  const hasNewDayStartedFlag = hasNewDayStarted(savedDate);
  
  if (hasNewDayStartedFlag) {
    console.log("A new day has started.");
  } else {
    console.log("The day has not changed yet.");
  }
  