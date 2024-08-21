import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import connectToDB from './db/index.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', apiRouter);

(async () => {
  try {
    await connectToDB();

    app.on('error', error => {
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error('ERROR:', error);
    process.exit(1);
  }
})();

export default app;
