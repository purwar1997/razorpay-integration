const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./routes/routes');
const config = require('./config/config');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://127.0.0.1:5500' }));
app.use(
  morgan(
    ':remote-addr :date[web] :method :url HTTP/:http-version :status :res[content-type] :res[content-length] :response-time ms'
  )
);
app.use(router);

app.listen(config.PORT, () => console.log(`Server is running on http://localhost:${config.PORT}`));
