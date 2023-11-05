const fs = require('fs');
const path = require("path")
// Define the name of the directory you want to create
const directoryName = 'new_directory';

// Check if the directory already exists
if (!fs.existsSync(directoryName)) {
  // If it doesn't exist, create it
  fs.mkdir(path.join(__dirname, directoryName), (err) => {
    if (err) {
        console.error('Error creating directory:', err);
    } else {
      console.log('Directory created successfully');
    }
  });
} else {
  console.log('Directory already exists');
}


function lol(){

}

