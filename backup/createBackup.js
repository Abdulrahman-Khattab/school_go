//==============================================
//BACKUP PROCESS FIRST TYPE
//==============================================

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { sendFile } = require('../backup/sendTeleMessge');

// MongoDB Atlas connection string
const connectionString =
  'mongodb+srv://Abdulrahman:12345@nodejsproject.x3hvgne.mongodb.net/?retryWrites=true&w=majority&appName=NodeJSPROJECT';

// Function to perform the backup
function performBackup() {
  // Define backup directory with timestamp
  const backupDir = path.join(
    'C:/Users/CORE/Desktop/backupfolder',
    new Date().toISOString().replace(/:/g, '-')
  );
  fs.mkdirSync(backupDir, { recursive: true });

  // Run mongodump command
  const dumpCommand = `mongodump --uri="${connectionString}" --out ${backupDir}`;
  exec(dumpCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }

    console.log(`Backup completed: ${stdout}`);

    // After mongodump completes, compress the backup directory into a .rar file
    // Define the .rar file path
    const rarFilePath = `${backupDir}.rar`;

    // Full path to rar.exe
    const rarExePath = `"C:\\Program Files\\WinRAR\\rar.exe"`;

    // Run WinRAR command to compress the backup directory into a .rar file
    const rarCommand = `${rarExePath} a -r ${rarFilePath} ${backupDir}`;
    exec(rarCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error compressing backup: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr during compression: ${stderr}`);
        return;
      }
      console.log(`Backup compressed into: ${rarFilePath}`);

      sendFile(rarFilePath);
    });
  });
}

module.exports = { performBackup };
