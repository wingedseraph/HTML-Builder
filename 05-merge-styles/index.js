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
  const DATA = [];
  const FILES = [];

  handleError(error);
  files.forEach((file) => {
    if (
      file.isFile() &&
      PATH.extname(PATH.join(STYLES_FOLDER, file.name)) === '.css'
    ) {
      FILES.push(file.name);
    }
  });
  FILES.forEach((file, index) => {
    // let data = '';
    const INPUT = FS.createReadStream(PATH.join(STYLES_FOLDER, file), 'utf-8');
    INPUT.on('data', (chunk) => DATA.push(chunk));
    INPUT.on('error', (error) => console.error(error.message));
    INPUT.on('end', () => {
      // DATA.push(data);

      if (FILES.length - 1 === index) {
        const NEW_DATA = DATA.join('');
        const BUNDLE_PATH = PATH.join(PROJECT_FOLDER, 'bundle.css');

        FS.writeFile(BUNDLE_PATH, NEW_DATA, (error) => {
          handleError(error);
          console.log(ASCII + 'teddy merge');
        });
      }
    });
  });
});
function handleError(error) {
  if (error) {
    return console.error(error.message);
  }
}
