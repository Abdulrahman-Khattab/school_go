const express = require('express');
const connectDB = require('./db/connect');
require('express-async-errors');
require('dotenv');
const fileUploader = require('express-fileupload');
const School_post_Router = require('./routes/school_post');

const app = express();
app.use(express.json());
app.use(fileUploader());

// static
app.use(express.static('public'));

//Routers

app.use('/schoolSystem/v1/api/schoolPost', School_post_Router);

app.get('/', async (req, res) => {
  res.send('hello world');
});

const start = async () => {
  try {
    await connectDB(
      'mongodb+srv://Abdulrahman:12345@nodejsproject.x3hvgne.mongodb.net/?retryWrites=true&w=majority&appName=NodeJSPROJECT'
    );
    app.listen(5000, () => {
      console.log('app listen to port 5000 ');
    });
  } catch (error) {
    console.log(error);
  }
};
start();
