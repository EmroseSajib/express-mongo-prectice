const express = require('express');
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
const port = 3000;
app.use(cors());

const simpleLogger = (req, res, next) => {
  console.log(`${req.url} - ${req.method}`);
  const name = req.query.name;
  if (name === 'salam') {
    return res.json({ message: 'Bad Request !' });
  }
  next();
};
app.use(simpleLogger);

app.get('/hello', (req, res, next) => {
  res.json({ message: 'hello ! Sajib....' });
});
app.get('/', (req, res, next) => {
  res.json({ message: 'hello ! Home....' });
});

app.listen(port, () => {
  console.log(`Example app lstening on port ${port}`);
});
