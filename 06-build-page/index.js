const fs = require("fs");
const path = require("path");

const deleteDir = (dirPath, cb) => {
  fs.rm(dirPath, { recursive: true }, (err) => {
    if (err && err.code !== "ENOENT") throw err;
    cb && cb();
  });
};

const createDir = (dirPath, cb) => {
  fs.mkdir(dirPath, (err) => {
    if (err) throw err;
    cb && cb();
  });
};

const replaceAllTemplates = (templateFilePath, resultFilePath, cb) => {
  const input = fs.createReadStream(templateFilePath, "utf-8");

  input.on("readable", () => {
    let data = input.read();

    if (!data) {
      return;
    }

    const matches = data.matchAll(/{{[^}]+}}/g);

    const replaceMatch = (match) => {
      if (!match.done) {
        const stringToReplace = match.value[0]; // contains string like "{{header}}"
        const componentName = stringToReplace.substring(2, stringToReplace.length - 2); // contains string like "header"

        // find a element in components dir with the name `${componentName}.html`
        const componentPath = path.join(__dirname, "components", `${componentName}.html`);
        const componentStream = new fs.ReadStream(componentPath, "utf-8");
        componentStream.on("readable", () => {
          const componentContent = componentStream.read();
          if (componentContent) {
            data = data.replace(stringToReplace, componentContent);
          }
        });

        componentStream.on("error", (err) => {
          componentStream.close();
          throw err;
        });

        componentStream.on("end", () => {
          componentStream.close();

          // there might be other templates to replace, check it
          replaceMatch(matches.next());
        });
      } else {
        // all templates were replaced
        const output = fs.createWriteStream(resultFilePath);
        output.write(data);
        output.close();

        cb && cb();
      }
    };

    replaceMatch(matches.next());
  });

  input.on("error", (err) => {
    if (err) throw err;
  });
};

const mergeStyles = (stylesFolderPath, bundleStylesPath, cb) => {
  const bundleStyles = fs.createWriteStream(bundleStylesPath);

  fs.readdir(stylesFolderPath, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    let i = 0;
    const writeData = () => {
      const element = files[i];

      if (path.extname(element.name) === ".css") {
        const stream = new fs.ReadStream(path.join(stylesFolderPath, element.name));
        stream.on("readable", () => {
          const data = stream.read();
          if (data) {
            bundleStyles.write(data);

            if (i++ < files.length - 1) {
              writeData();
            } else {
              cb && cb();
            }
          }
        });

        stream.on("error", (err) => {
          throw err;
        });
      }
    };

    writeData();
  });
};

const copyDir = (sourceFolder, targetFolder) => {
  deleteDir(targetFolder, () => {
    createDir(targetFolder, () => {
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
  });
};

const distPath = path.join(__dirname, "project-dist");

const templateFilePath = path.join(__dirname, "template.html");
const indexHTMLFilePath = path.join(distPath, "index.html");

const stylesFolderPath = path.join(__dirname, "styles");
const bundleStylesPath = path.join(__dirname, "project-dist", "style.css");

const assetsFolderPath = path.join(__dirname, "assets");
const newAssetsFolderPath = path.join(__dirname, "project-dist", "assets");

deleteDir(distPath, () => {
  createDir(distPath, () => {
    replaceAllTemplates(templateFilePath, indexHTMLFilePath);
    mergeStyles(stylesFolderPath, bundleStylesPath);
    copyDir(assetsFolderPath, newAssetsFolderPath);
  });
});
