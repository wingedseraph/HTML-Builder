const PATH = require('path');
const FS = require('fs');
const PROJECT_FOLDER = PATH.join(__dirname, 'project-dist');
const STYLES_FOLDER = PATH.join(__dirname, 'styles');

const ASCII = `
           _  ,-.
         (,-/)  )
         /      \\
      o-' 9      ;
      \\         /
       \`-.     (
       ,'/  ,--.;
,-. _,','  /   ||
|  (  / _,'    /|
>-. \`( (    _,' |
|  \\_.--\`~~' \`.  )
|             ;-'
\`.__,.      ,'
      \`----'  
`;

FS.readdir(STYLES_FOLDER, { withFileTypes: true }, (error, files) => {
  isErrorMessage(error);
  const FILES = [];
  files.forEach((file) => {
    if (
      file.isFile() &&
      PATH.extname(PATH.join(STYLES_FOLDER, file.name)) === '.css'
    ) {
      FILES.push(file.name);
    }
  });
  const DATA = [];
  FILES.forEach((file, index) => {
    const INPUT = FS.createReadStream(PATH.join(STYLES_FOLDER, file), 'utf-8');
    let data = '';
    INPUT.on('data', (chunk) => (data += chunk));
    INPUT.on('error', (error) => console.error(error.message));
    INPUT.on('end', () => {
      DATA.push(data);

      if (FILES.length - 1 === index) {
        const NEW_DATA = DATA.join('');
        const BUNDLE_PATH = PATH.join(PROJECT_FOLDER, 'bundle.css');

        FS.writeFile(BUNDLE_PATH, NEW_DATA, (error) => {
          isErrorMessage(error);
          console.log(ASCII + 'teddy merge');
        });
      }
    });
  });
});
function isErrorMessage(error) {
  if (error) {
    return console.error(error.message);
  }
}
