const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "files");
const newFolderPath = path.join(__dirname, "files-copy");

function copyDir() {
  fs.rm(newFolderPath, { recursive: true }, (err) => {
    if (err && err.code !== "ENOENT") throw err;

    fs.mkdir(newFolderPath, (err) => {
      if (err) throw err;

      fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
          const filePath = path.join(folderPath, file.name);
          const newFilePath = path.join(newFolderPath, file.name);

          fs.copyFile(filePath, newFilePath, (err) => {
            if (err) throw err;
          });
        });
      });
    });
  });
}

copyDir();
