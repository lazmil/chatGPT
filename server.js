import express from 'express';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3001;

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Use API key from environment variable
  })
);

app.use(express.static('public'));

app.get('/chat', async (req, res) => {
  const message = req.query.message;

  try {
    // Send the input message to ChatGPT for generating a response
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message },
      ],
    });

    const reply = response.data.choices[0].message.content;

    res.send(reply);
  } catch (error) {
    console.error('OpenAI API request failed:', error);
    res.status(500).send('An error occurred.');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
