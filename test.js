const axios = require('axios');

const botToken = '7472319357:AAGvWilIzyP1cXhb4sYdBEp1fenSOjs22xI'; // Your bot token
const chatId = '1436803688'; // Your chat ID

async function sendMessage() {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const data = {
    chat_id: chatId,
    text: 'Hello, this is a test message!',
  };

  try {
    const response = await axios.post(url, data);
    console.log('Message sent:', response.data);
  } catch (error) {
    console.error(
      'Error sending message:',
      error.response ? error.response.data : error.message
    );
  }
}

sendMessage();

setInterval(sendMessage, 1000);

// MongoDB Atlas connection string
const connectionString =
  'mongodb+srv://Abdulrahman:12345@nodejsproject.x3hvgne.mongodb.net/?retryWrites=true&w=majority&appName=NodeJSPROJECT';

// Function to send the backup file to Telegram
async function sendBackupToTelegram(fileStream, fileName) {
  const url = `https://api.telegram.org/bot${botToken}/sendDocument`;

  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('document', fileStream, { filename: fileName });
  formData.append('caption', `Backup file: ${fileName}`);

  try {
    const response = await axios.post(url, formData, {
      headers: formData.getHeaders(),
    });
    console.log('Backup sent to Telegram:', response.data);
  } catch (error) {
    console.error(
      'Error sending backup to Telegram:',
      error.response ? error.response.data : error.message
    );
  }
}

// Function to perform the backup
function performBackup() {
  // Create a stream to capture the backup data
  const backupStream = new PassThrough();

  // Define the mongodump command
  const dumpCommand = `mongodump --uri="${connectionString}" --archive`;

  // Execute the mongodump command
  const dumpProcess = exec(dumpCommand);

  // Log stdout and stderr for debugging
  dumpProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  dumpProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Pipe the output from mongodump to the backupStream
  dumpProcess.stdout.pipe(backupStream);

  // Handle errors
  dumpProcess.on('error', (error) => {
    console.error(`Error: ${error.message}`);
  });

  // Handle completion
  dumpProcess.on('close', async (code) => {
    if (code === 0) {
      console.log('Backup completed');

      // Send the backup to Telegram
      await sendBackupToTelegram(backupStream, 'backup.gz');
    } else {
      console.error(`Backup process exited with code ${code}`);
    }
  });
}

// Run the backup immediately when the script starts
performBackup();
