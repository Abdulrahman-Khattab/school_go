const axios = require('axios');
const fs = require('fs');
const path = require('path');

const botToken = '7472319357:AAGvWilIzyP1cXhb4sYdBEp1fenSOjs22xI'; // Your bot token
const chatId = '1436803688'; // Your chat ID

/*async function sendMessage(backupData) {
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
}*/

async function sendFile(filePath) {
  const url = `https://api.telegram.org/bot${botToken}/sendDocument`;
  const fileName = path.basename(filePath);

  try {
    const response = await axios.post(
      url,
      {
        chat_id: chatId,
        caption: 'Here is your backup file:',
        document: fs.createReadStream(filePath), // Attach the file as a stream
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('File sent:', response.data);
  } catch (error) {
    console.error(
      'Error sending file:',
      error.response ? error.response.data : error.message
    );
  }
}

module.exports = {
  sendFile,
};
// Example usage: sending a specific file
