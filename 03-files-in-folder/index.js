const promises = require("fs/promises");
const path = require("path");
const fs = require("fs");
const folderPath = path.join(__dirname, "secret-folder");

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  files.forEach((element) => {
    if (element.isFile()) {
      const filePath = path.join(folderPath, element.name);
      //console.log(filePath);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(
          element.name.slice(0, element.name.lastIndexOf(".")) + " - " + path.extname(element.name).slice(1) + " - " + stats.size / 1024 + "kb"
        );
      });
    }
  });
});
