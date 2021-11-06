const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "files");
const newFolderPath = path.join(__dirname, "files-copy");

fs.rm(newFolderPath, { recursive: true }, (err) => {
  if (err && err.code !== "ENOENT") throw err;

  function copyDir(sourceFolder, targetFolder) {
    fs.mkdir(targetFolder, (err) => {
      if (err) throw err;

      fs.readdir(sourceFolder, { withFileTypes: true }, (err, elements) => {
        if (err) throw err;

        elements.forEach((element) => {
          if (element.isFile()) {
            const filePath = path.join(sourceFolder, element.name);
            const newFilePath = path.join(targetFolder, element.name);

            fs.copyFile(filePath, newFilePath, (err) => {
              if (err) throw err;
            });
          } else {
            const subFolderPath = path.join(sourceFolder, element.name);
            const newSubFolderPath = path.join(targetFolder, element.name);

            copyDir(subFolderPath, newSubFolderPath);
          }
        });
      });
    });
  }
  copyDir(folderPath, newFolderPath);
});
