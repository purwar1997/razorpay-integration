const express = require('express');
const config = require('./config/config');

const app = express();

app.get('/api', (req, res) => {
  res.status(200).send('Welcome');
});

app.listen(config.PORT, () => console.log(`Server is running on http://localhost:${config.PORT}`));
