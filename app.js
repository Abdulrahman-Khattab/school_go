// main imported library
const express = require('express');
const connectDB = require('./db/connect');
require('express-async-errors');
require('dotenv').config();
const fileUploader = require('express-fileupload');
const cookieParser = require('cookie-parser');

//Routers import
const School_post_Router = require('./routes/school_post');
const student_marks_router = require('./routes/student_marks');
const user_Routers = require('./routes/users');
const Weekly_schedule_router = require('./routes/weekly_schedule');
const exam_schedule_router = require('./routes/exam_schedule');
const Monthly_calender_router = require('./routes/monthly_calender');
const books_router = require('./routes/books');
const homeWorks_router = require('./routes/homeWorks');
const quiz_router = require('./routes/quiz');
const resource_router = require('./routes/resource');

// using main utility library
const app = express();
app.use(express.json());
app.use(fileUploader());
app.use(cookieParser(process.env.JWT_SECRET));

// static
app.use(express.static('public'));

//Routers
app.use('/schoolSystem/v1/api/schoolPost', School_post_Router);
app.use('/schoolSystem/v1/api/studentMarks', student_marks_router);
app.use('/schoolSystem/v1/api/users', user_Routers);
app.use('/schoolSystem/v1/api/weeklySchedule', Weekly_schedule_router);
app.use('/schoolSystem/v1/api/examSchedule', exam_schedule_router);
app.use('/schoolSystem/v1/api/monthlyCalender', Monthly_calender_router);
app.use('/schoolSystem/v1/api/books', books_router);
app.use('/schoolSystem/v1/api/homeWorks', homeWorks_router);
app.use('/schoolSystem/v1/api/quiz', quiz_router);
app.use('/schoolSystem/v1/api/resource', resource_router);

// front-page (test mode only)
app.get('/', async (req, res) => {
  res.send('hello world');
});

//==============================================
//BACKUP PROCESS
//==============================================
/*
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

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
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Backup completed: ${stdout}`);
  });
}
// Run the backup immediately when the script starts
performBackup();
*/
//==============================================
//END OF BACKUP PROCESS
//==============================================

//==============================================
//RESTORE PROCESS
//==============================================
// MongoDB Atlas connection string
/*const connectionString2 =
  'mongodb+srv://Abdulrahman:12345@nodejsproject.x3hvgne.mongodb.net/?retryWrites=true&w=majority&appName=NodeJSPROJECT';

// Function to perform the restore
function restoreBackup(backupDir) {
  const restoreCommand = `mongorestore --uri="${connectionString2}" --drop ${backupDir}`;
  exec(restoreCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Restore completed: ${stdout}`);
  });
} */

//=======================================================
//THIS CODE SHOULD BE USED IN CASE OF DISSASTER ONLY
//=====================================================

//==============================================
//END OF RESTORE PROCESS
//==============================================

// running server
const start = async () => {
  try {
    await connectDB(process.env.DATABASE_URL);
    app.listen(5000, () => {
      console.log('app listen to port 5000 ');
    });
  } catch (error) {
    console.log(error);
  }
};
start();

// Run backup every 30 minutes
//const thirtyMinutes = 60 * 30 * 1000;
//setInterval(performBackup, thirtyMinutes);
