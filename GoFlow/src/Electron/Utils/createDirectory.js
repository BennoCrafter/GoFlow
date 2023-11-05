const fs = require("fs");

function createDirectory(path, dirName){
    const fullPath = path + "/" + dirName
    if (
        !fs.existsSync(fullPath)
      ) {
        fs.mkdir(
            fullPath,
          (err) => {
            if (err) {
              console.error("Error creating directory:", err);
            } else {
              console.log("Directory created successfully");
            }
          }
        );
      } else {
        console.log("Directory already exists");
      }
}
module.exports = { createDirectory } 
