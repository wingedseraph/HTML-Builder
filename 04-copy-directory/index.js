const PATH = require('path');
const FS = require('fs');

const FILESPATH = PATH.join(__dirname, 'files');
const COPYFILEPATH = PATH.join(__dirname, 'files-copy');
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

FS.readdir(FILESPATH, (error, files) => {
  console.log(files);
  isErrorMessage(error);

  FS.mkdir(COPYFILEPATH, { recursive: true }, isErrorMessage);
  FS.readdir(COPYFILEPATH, (error, copyFiles) => {
    if (copyFiles) {
      isErrorMessage(error);

      let filesArray = copyFiles;
      // console.log('DEBUG::filesArray:', filesArray);

      files.forEach((file) => {
        filesArray = filesArray.filter((item) => item !== file);
      });

      filesArray.forEach((file) => {
        FS.unlink(PATH.join(COPYFILEPATH, file), isErrorMessage);
      });
    }
  });

  files.forEach((file) => {
    FS.copyFile(
      PATH.join(FILESPATH, file),
      PATH.join(COPYFILEPATH, file),
      isErrorMessage,
    );
  });

  console.log(ASCII, 'new folder sprouted: Musholder 🍄');
});

function isErrorMessage(error) {
  if (error) {
    return console.error(error.message);
  }
}
