// TODO: without Sync or SetTimeout

const FS = require('fs');
const PATH = require('path');

const FOLDERPATH = PATH.join(__dirname, 'secret-folder');

FS.readdir(FOLDERPATH, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  const PROCCESSFILE = (fileName) => {
    const FILEPATH = PATH.join(FOLDERPATH, fileName);
    FS.stat(FILEPATH, (statErr, fileStats) => {
      if (statErr) {
        console.error(statErr.message);
        return;
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
        console.error(statErr.message);
        return;
      }

      if (stats.isFile()) {
        PROCCESSFILE(file);
      }
    });
  });
});
