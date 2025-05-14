// server.js (backend)
import 'dotenv/config';
import express from 'express';
import {fetchAnswer} from "../services/openAi.ts"
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json()); 

app.post('/chat', async (req, res) => {
  try {
    const result = await fetchAnswer({chatUserInput: req.body?.message});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

app.listen(3000, () => console.log('Backend running on port 3000'));
