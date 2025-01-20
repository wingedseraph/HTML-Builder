const PATH = require('path');
const fs = require('fs');

const PROJECT_FOLDER = PATH.join(__dirname, 'project-dist');
const STYLES_FOLDER = PATH.join(__dirname, 'styles');

const template_file = PATH.join(__dirname, 'template.html');
const COMPONENTS_FOLDER = PATH.join(__dirname, 'components');

const FILES_PATH = PATH.join(__dirname, 'assets');
const COPY_FILE_PATH = PATH.join(__dirname, 'project-dist/assets');

function handleError(err) {
  if (err) {
    console.error(' >> ERROR:', err);
    process.exit(1);
  }
}

// parse html templates
function readComponentFilesAndReplace(templateContent, callback) {
  fs.readdir(COMPONENTS_FOLDER, { withFileTypes: true }, (err, files) => {
    if (err) return handleError(err);

    const components = {};
    let filesProcessed = 0;

    files.forEach((file) => {
      if (file.isFile() && PATH.extname(file.name) === '.html') {
        const componentName = `{{${PATH.parse(file.name).name}}}`;
        fs.readFile(
          PATH.join(COMPONENTS_FOLDER, file.name),
          'utf8',
          (err, content) => {
            if (err) return handleError(err);
            components[componentName] = content;
            filesProcessed++;
            if (filesProcessed === files.length) {
              let result = templateContent;
              for (const componentName in components) {
                result = result.replace(
                  componentName,
                  components[componentName],
                );
              }
              callback(result);
            }
          },
        );
      } else {
        filesProcessed++;
        if (filesProcessed === files.length) {
          callback(templateContent);
        }
      }
    });
  });
}

// write index.html
fs.readFile(template_file, 'utf8', (err, templateContent) => {
  if (err) handleError(err);

  fs.mkdir(PROJECT_FOLDER, { recursive: true }, (err) => {
    if (err) handleError(err);
    readComponentFilesAndReplace(templateContent, (finalContent) => {
      fs.writeFile(
        PATH.join(PROJECT_FOLDER, 'index.html'),
        finalContent,
        (err) => {
          if (err) handleError(err);
          // console.log('html created');
        },
      );
    });
  });
});

// merge css style files
fs.readdir(STYLES_FOLDER, { withFileTypes: true }, (err, files) => {
  if (err) handleError(err);

  const DATA = [];
  const FILES = [];

  files.forEach((file) => {
    if (
      file.isFile() &&
      PATH.extname(PATH.join(STYLES_FOLDER, file.name)) === '.css'
    ) {
      FILES.push(file.name);
    }
  });

  let data = '';
  FILES.forEach((file, index) => {
    const INPUT = fs.createReadStream(PATH.join(STYLES_FOLDER, file), 'utf-8');
    INPUT.on('data', (chunk) => (data += chunk));
    INPUT.on('error', (err) => console.error(err));
    INPUT.on('end', () => {
      DATA.push(data);
      if (FILES.length - 1 === index) {
        const NEW_DATA = DATA.join('');
        const BUNDLE_PATH = PATH.join(PROJECT_FOLDER, 'style.css');
        fs.writeFile(BUNDLE_PATH, NEW_DATA, (err) => {
          if (err) handleError(err);
          // console.log('css files have been merged into style.css');
        });
      }
    });
  });
});

// copy directory and files
function copyDirectoryRecursively(sourceDir, targetDir) {
  fs.readdir(sourceDir, (err, files) => {
    if (err) handleError(err);

    fs.mkdir(targetDir, { recursive: true }, (err) => {
      if (err) handleError(err);
      files.forEach((file) => {
        const sourcePath = PATH.join(sourceDir, file);
        const targetPath = PATH.join(targetDir, file);
        fs.stat(sourcePath, (err, stats) => {
          if (err) handleError(err);
          if (stats.isDirectory()) {
            copyDirectoryRecursively(sourcePath, targetPath); // copy directory
          } else if (stats.isFile()) {
            fs.copyFile(sourcePath, targetPath, handleError); // copy files
          }
        });
      });
    });
  });
}

// copy assets files
fs.readdir(FILES_PATH, (err, files) => {
  if (err) handleError(err);

  fs.mkdir(COPY_FILE_PATH, { recursive: true }, (err) => {
    if (err) handleError(err);

    // console.log('assets folder');

    files.forEach((file) => {
      const sourcePath = PATH.join(FILES_PATH, file);
      const destinationPath = PATH.join(COPY_FILE_PATH, file);

      fs.stat(sourcePath, (err, stats) => {
        if (err) handleError(err);

        if (stats.isDirectory()) {
          copyDirectoryRecursively(sourcePath, destinationPath);
        } else if (stats.isFile()) {
          fs.copyFile(sourcePath, destinationPath, handleError);
        }
      });
    });

    // console.log('assets done');
  });
});
console.log('done');
