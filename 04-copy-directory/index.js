const PATH = require('path');
const FS = require('fs');

const FILES_PATH = PATH.join(__dirname, 'files');
const COPY_FILE_PATH = PATH.join(__dirname, 'files-copy');
const ASCII = `
    _,--'       "-.
  ,'.  .            \\
,/:. .     .       .'
|;..  .      _..--'
\`--:...-,-'"\\
        |:.  \`.
        l;.   l
        \`|:.   |
         |:.   \`.,
        .l;.    j, ,
     \`. \\\`;:.   //,/
      .\\\\)\`;:,|\\'/(
       \` \`\`(\`,\``;

FS.readdir(FILES_PATH, (error, files) => {
  console.log(files);
  handleError(error);

  FS.mkdir(COPY_FILE_PATH, { recursive: true }, handleError);
  FS.readdir(COPY_FILE_PATH, (error, copyFiles) => {
    if (copyFiles) {
      handleError(error);

      let filesArray = copyFiles;
      // console.log('DEBUG::filesArray:', filesArray);

      files.forEach((file) => {
        filesArray = filesArray.filter((item) => item !== file);
      });

      filesArray.forEach((file) => {
        FS.unlink(PATH.join(COPY_FILE_PATH, file), handleError);
      });
    }
  });

  files.forEach((file) => {
    FS.copyFile(
      PATH.join(FILES_PATH, file),
      PATH.join(COPY_FILE_PATH, file),
      handleError,
    );
  });

  console.log(ASCII, 'new folder sprouted: Musholder 🍄');
});

function handleError(error) {
  if (error) {
    return console.error(error.message);
  }
}
