const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "text.txt");
const stream = new fs.ReadStream(filePath);

stream.on("readable", () => {
  const data = stream.read();
  if (data != null) console.log(data.toString());
});

stream.on("error", (err) => {
  if (err.code == "ENOENT") {
    console.log("Файл не найден");
  } else {
    console.error(err);
  }
});
