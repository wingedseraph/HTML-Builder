const FS = require('fs');
const PATH = require('path');

const FOLDER_PATH = PATH.join(__dirname, 'secret-folder');

FS.readdir(FOLDER_PATH, (err, files) => {
  if (err) {
    return console.error(err);
  }

  const PROCCESS_FILE = (fileName) => {
    const FILE_PATH = PATH.join(FOLDER_PATH, fileName);
    FS.stat(FILE_PATH, (statErr, fileStats) => {
      if (statErr) {
        return console.error(statErr.message);
      }

      console.log(
        `${PATH.parse(fileName).name} - ${PATH.extname(fileName).slice(1)} - ${(
          fileStats.size / 1024
        ).toFixed(3)}kb`,
      );
    });
  };

  files.forEach((file) => {
    const FILEPATH = PATH.join(FOLDER_PATH, file);
    FS.stat(FILEPATH, (statErr, stats) => {
      if (statErr) {
        return console.error(statErr.message);
      }

      if (stats.isFile()) {
        PROCCESS_FILE(file);
      }
    });
  });
});
