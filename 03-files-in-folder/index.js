const FS = require('fs');
const PATH = require('path');

const FOLDERPATH = PATH.join(__dirname, 'secret-folder');

FS.readdir(FOLDERPATH, (err, files) => {
  if (err) {
    return console.error(err);
  }

  const PROCCESSFILE = (fileName) => {
    const FILEPATH = PATH.join(FOLDERPATH, fileName);
    FS.stat(FILEPATH, (statErr, fileStats) => {
      if (statErr) {
        return console.error(statErr.message);
      }

      console.log(
        `${fileName} - ${PATH.extname(fileName).slice(1)} - ${(
          fileStats.size / 1024
        ).toFixed(3)}kb`,
      );
    });
  };

  files.forEach((file) => {
    const FILEPATH = PATH.join(FOLDERPATH, file);
    FS.stat(FILEPATH, (statErr, stats) => {
      if (statErr) {
        return console.error(statErr.message);
      }

      if (stats.isFile()) {
        PROCCESSFILE(file);
      }
    });
  });
});
