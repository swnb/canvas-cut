const fs = require("fs");
const path = require("path");

let counts = 0;

function r(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) return console.error(err);

    files.forEach(file => {
      const absPath = path.resolve(dirPath, file);

      fs.stat(absPath, (err, stats) => {
        if (err) return console.error(err);

        if (stats.isDirectory(absPath)) {
          r(absPath);
        } else {
          const n = fs
            .readFileSync(absPath)
            .toString()
            .split("\n").length;
          counts += n;
        }
      });
    });
  });
}

r("./src/tpscript");

process.on("exit", () => {
  console.log(counts);
});
