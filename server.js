const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const events = req.body.events;

  // Loop through each event in the payload
  events.forEach(event => {
    // Handle message event
    if (event.type === 'message' && event.message.type === 'text') {
      handleMessageEvent(event);
    }

    // Handle "unfollow" event
    if (event.type === 'unfollow') {
      handleUnfollowEvent(event);
    }
  });

  // Respond with a 200 OK to acknowledge receipt of the webhook event
  res.status(200).send('OK');
});

function handleMessageEvent(event) {
  const userId = event.source.userId;
  const userMessage = event.message.text.toLowerCase();

  // Check user's message and respond accordingly
  if (userMessage.includes('rent apartment')) {
    sendOptions(userId, 'Select your preferred city to rent an apartment:');
  } else {
    // Handle other message types or implement additional logic
    // Respond with a default message or instructions
    sendOptions(userId, 'Select your favorite city to rent an apartment:');
  }
}

function handleUnfollowEvent(event) {
  const userId = event.source.userId;
  console.log(`User ${userId} unfollowed the channel.`);
  // Implement additional logic as needed
}

function sendOptions(userId, messageText) {
  // Send options for renting apartments in major cities
  const message = {
    type: 'text',
    text: messageText,
    quickReply: {
      items: [
        {
          type: 'action',
          action: {
            type: 'message',
            label: 'Tokyo',
            text: 'Tokyo',
          },
        },
        {
          type: 'action',
          action: {
            type: 'message',
            label: 'Osaka',
            text: 'Osaka',
          },
        },
        {
          type: 'action',
          action: {
            type: 'message',
            label: 'Kyoto',
            text: 'Kyoto',
          },
        },
        {
          type: 'action',
          action: {
            type: 'location',
            label: 'Send location',
          },
        },
      ],
    },
  };
  replyToUser(userId, message);
}

function replyToUser(userId, message) {
    const postData = JSON.stringify({
      to: userId,
      messages: [message],
    });
  
    const options = {
      hostname: 'api.line.me',
      path: '/v2/bot/message/push',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer E8LVOfISOW905fFJpCEsaPeUVqoLOA2WZDj/p+7+bA4a1QpTf6izSyKSqwXxcDXEEj8L07y5DrXAk4CuXLiQX/z7wKGrcbJKOOGk9Ew/Z73p6xAteDzU2KtfS3pLNaVsYeqrCHNsUKYv0g6fBbWuUAdB04t89/1O/w1cDnyilFU=',
      },
    };
  
    const req = https.request(options, res => {
      let data = '';
  
      res.on('data', chunk => {
        data += chunk;
      });
  
      res.on('end', () => {
        console.log(`Message sent successfully: ${data}`);
      });
    });
  
    req.on('error', error => {
      console.error(`Error sending message: ${error.message}`);
    });
  
    req.write(postData);
    req.end();
  }

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
