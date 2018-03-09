const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors')

const server = express();
server.use(cors);
// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
server.use(bodyParser.json());

server.use(express.static(path.join(__dirname, 'build')));
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'build/index.html'));
});

server.listen(3000, () => {
  console.log('Listening on post 3000');
})