const { exec } = require("child_process");

async function runNodeFiles() {
  const files = ["./...prepare.js", "./..go.js"];

  for (const file of files) {
    console.log(`Running ${file}...`);
    await runNodeFile(file);
    console.log(`${file} has finished running.`);
  }

  console.log("All files have been run!");
}

async function runNodeFile(file) {
  return new Promise((resolve, reject) => {
    exec(`node ${file}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running ${file}:`, error);
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

runNodeFiles()
  .then(() => console.log("All files have finished running."))
  .catch((error) => console.error("An error occurred:", error));
