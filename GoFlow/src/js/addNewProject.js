const inputDialog = document.getElementById('inputDialog');
const inputField = document.getElementById('inputField'); 
const width = 300
// Add an event listener for the New Project button

window.electronAPI.onNewProject(()=>{
  inputField.placeholder = "Enter project name"
  inputDialog.querySelector("#submitButton").textContent = "Create new Project"
  if (inputDialog.style.display === 'block') {
    inputDialog.style.display = 'none';
  } else {
    inputDialog.style.top = 100 + 'px';
    inputDialog.style.left = window.innerWidth / 2 - width / 2 + 'px';
    inputDialog.style.display = 'block';

    // Focus the input field when the menu is displayed
    inputField.focus();
  }
});

// Handle Enter key press in the input field
inputField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    // Process the project name input and close the menu
    const projectName = inputField.value;

    inputDialog.style.display = 'none';
    window.electronAPI.saveData(projectName, "", true, null, null)
    // Optionally, reset the input field
    inputField.value = '';
    vt.sucess("Succesfull to create new Project", {
        title: "Sucess!",
        position: "top-left",
    })
  }
});
inputDialog.querySelector("#submitButton").onclick = function(){
  const projectName = inputField.value;

  inputDialog.style.display = 'none';
  window.electronAPI.saveData(projectName, "", true, null, null)
  // Optionally, reset the input field
  inputField.value = '';
};
// Close the menu when clicking outside
document.addEventListener('click', (event) => {
  if (!inputDialog.contains(event.target)) {
    inputDialog.style.display = 'none';
  }
});
