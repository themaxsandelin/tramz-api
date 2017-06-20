const express = require('express');
const request = require('request');
const dotenv = require('dotenv').config();

const api = express();

api.get('/', (req, res, next) => {
  res.send('Hello! 👋🏻');
});

api.get('/token', (req, res, next) => {
  const key = process.env.KEY;
  const secret = process.env.SECRET;

  request.post('https://api.vasttrafik.se:443/token', {
    headers: {
      'Authorization': 'Basic ' + new Buffer(key + ':' + secret).toString('base64')
    },
    body: 'grant_type=client_credentials'
  }, (error, response, body) => {
    if (error) reject(error);

    res.set('Content-Type', 'application/json');
    res.send(body);
  });
});

api.listen(3000, () => {
  console.log('API up and running. 🎉');
});
