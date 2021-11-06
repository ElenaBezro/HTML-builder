const fs = require("fs");
const path = require("path");

const stylesFolderPath = path.join(__dirname, "styles");
const bundleStylesPath = path.join(__dirname, "project-dist", "bundle.css");
const bundleStyles = fs.createWriteStream(bundleStylesPath);

fs.readdir(stylesFolderPath, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  let i = 0;
  const writeData = () => {
    const file = files[i];
    if (path.extname(file.name) === ".css") {
      const stream = new fs.ReadStream(path.join(stylesFolderPath, file.name));
      stream.on("readable", () => {
        const data = stream.read();
        if (data) {
          bundleStyles.write(data);
        }
        i++;
        if (i < files.length) {
          writeData();
        }
      });
      stream.on("error", (err) => {
        throw err;
      });
    }
  };
  writeData();
});
