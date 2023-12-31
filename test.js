const { exec } = require('child_process');
const fs = require('fs');

function runCProgram() {
  exec('./nowplaying-cli get-raw', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    const lines = stdout.slice(1, -1).split('\n');

    // Remove leading and trailing spaces, and join the lines
    const cleanedOutput = lines.map((line) => line.trim()).join('');
    
    // Convert to JSON by replacing "=" with ":" and removing the leading "kMRMediaRemoteNowPlayingInfo"
    const jsonOutput = cleanedOutput.replace(/kMRMediaRemoteNowPlayingInfo/g, '').replace(/=/g, ':').replace(/;/g, ",").replace(/undefined:1/g, "");
    
    // Parse the JSON
    const parsedOutput = JSON.parse(`{${jsonOutput}}`);
    
    console.log(parsedOutput);
    saveToJsFile(parsedOutput);
  });
}

function saveToJsFile(content) {
  fs.writeFile('output.json', content, (err) => {
    if (err) throw err;
    console.log('Output saved to output.js');
  });
}

runCProgram();
