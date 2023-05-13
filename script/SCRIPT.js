const { spawn } = require('child_process');

async function runNodeFiles() {
  const files = ['./...prepare.js', './..go.js'];

  for (const file of files) {
    console.log(`Running ${file}...`);
    await runNodeFile(file);
  }

  console.log('All files have been run!');
}

async function runNodeFile(file) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn('node', [file]);

    childProcess.on('error', (error) => {
      console.error(`Error running ${file}:`, error);
      reject(error);
    });

    childProcess.on('exit', (code) => {
      if (code === 0) {
        console.log(`${file} has finished running.`);
        resolve();
      } else {
        console.error(`${file} has failed with code ${code}.`);
        reject(code);
      }
    });
  });
}

runNodeFiles()
  .then(() => console.log('All files have finished running.'))
  .catch((error) => console.error('An error occurred:', error));
