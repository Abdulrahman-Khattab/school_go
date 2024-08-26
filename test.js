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
