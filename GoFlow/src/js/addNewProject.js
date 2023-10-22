const newProjectMenu = document.getElementById('newProjectMenu');
const projectNameInput = document.getElementById('projectNameInput'); // Assuming you have an input field for the project name

const width = 300
// Add an event listener for the New Project button
window.electronAPI.onNewProject(()=>{
  if (newProjectMenu.style.display === 'block') {
    newProjectMenu.style.display = 'none';
  } else {
    newProjectMenu.style.top = 100 + 'px';
    newProjectMenu.style.left = window.innerWidth / 2 - width / 2 + 'px';
    newProjectMenu.style.display = 'block';

    // Focus the input field when the menu is displayed
    projectNameInput.focus();
  }
});

// Handle Enter key press in the input field
projectNameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    // Process the project name input and close the menu
    const projectName = projectNameInput.value;

    newProjectMenu.style.display = 'none';
    window.electronAPI.saveData(projectName, "", true, null, null)
    // Optionally, reset the input field
    projectNameInput.value = '';
  }
});

// Close the menu when clicking outside
document.addEventListener('click', (event) => {
  if (!newProjectMenu.contains(event.target)) {
    newProjectMenu.style.display = 'none';
  }
});
