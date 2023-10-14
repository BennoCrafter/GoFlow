  let widgetSettingsMenu;

  // settings
  let hasTitle;
  widgetSettingsMenu = document.getElementById("widgetSettings");
  console.log(widgetSettingsMenu)
  let target;
  // Function to handle the right-click event
  export function handleWidgetSettingsMenu(event) {
    event.preventDefault(); // Prevent the default browser context menu
    target = event.target
    widgetSettingsMenu.style.left = event.clientX + "px";
    widgetSettingsMenu.style.top = event.clientY + "px";
    widgetSettingsMenu.style.display = "block";
  }
  
  // Function to process the entered parameters
  function processParameters() {
    hasTitle = document.getElementById("hasTitle").checked;
    hideWidgetSettingsMenu();
  }
  
  // Function to hide the custom context menu
  function hideWidgetSettingsMenu() {
    widgetSettingsMenu.style.display = "none";
  }
  
  // Close the custom context menu when clicking anywhere on the page
  document.addEventListener("click", function (event) {
    if (event.target.id !== "hasTitle") {
      hideWidgetSettingsMenu();
    }
  });

  export function getTarget(){
    return target
  }

  export function getSettingsData(){
    processParameters()
    return [hasTitle]
  }
  // submit button
  //document.getElementById("widgetSettingsSubmitButton").addEventListener("click", processParameters)
  
