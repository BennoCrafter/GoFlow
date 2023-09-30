async function saveFile() {
    try {
      // create a new handle
      const newHandle = await window.showSaveFilePicker();
  
      // create a FileSystemWritableFileStream to write to
      const writableStream = await newHandle.createWritable();
  
      // write our file
      await writableStream.write("This is my file content");
  
      // close the file and write the contents to disk.
      await writableStream.close();
    } catch (err) {
      console.error(err.name, err.message);
    }
  }
saveFile()