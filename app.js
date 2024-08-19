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

// front-page (test mode only)
app.get('/', async (req, res) => {
  res.send('hello world');
});

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
