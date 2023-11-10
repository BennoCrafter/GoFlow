const fs = require("fs");
const path = require("path");

async function readDataFromDirectory(directoryPath) {
    const projects = await fs.promises.readdir(directoryPath);
    const projectData = [];
  
    for (const project of projects) {
      if (project == ".DS_Store" || project == "order.json") {
        continue;
      }
      const projectPath = path.join(directoryPath, project);
      const pages = await fs.promises.readdir(projectPath);
  
      const projectInfo = {
        name: project,
        pagesData: [],
      };
  
      for (const page of pages) {
        const pagePath = path.join(projectPath, page);
        const widgets = await fs.promises.readdir(pagePath);
  
        const pageInfo = {
          name: page,
          widgetsData: [],
        };
  
        for (const widget of widgets) {
          const widgetPath = path.join(pagePath, widget);
  
          // Ensure the file is a JSON file
          if (path.extname(widget) === ".json") {
            const data = await fs.promises.readFile(widgetPath, "utf8");
            const jsonData = JSON.parse(data);
            pageInfo.widgetsData.push(jsonData);
          }
        }
  
        projectInfo.pagesData.push(pageInfo);
      }
      projectData.push(projectInfo);
    }
    return projectData;
  }

module.exports = { readDataFromDirectory }