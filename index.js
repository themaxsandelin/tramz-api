const fs = require('fs');
const moment = require('moment');
const express = require('express');
const request = require('request');
const dotenv = require('dotenv').config();
const useragent = require('express-useragent');

const api = express();

api.use(useragent.express());
api.use((req, res, next) => {
  const now = moment();
  const ua = {
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    path: req.originalUrl,
    platform: req.useragent.platform,
    os: req.useragent.os,
    timestamp: now.format('x'),
    browser: {
      name: req.useragent.browser,
      version: req.useragent.version
    }
  };

  if (!fs.existsSync('./log')) fs.mkdirSync('./log');
  const logPath = './log/' + now.format('YYYY-MM-DD') + '.json';

  const data = (fs.existsSync(logPath)) ? JSON.parse(fs.readFileSync(logPath)):[];

  data.push(ua);
  fs.writeFileSync(logPath, JSON.stringify(data));
  next();
});

api.get('/', (req, res) => {
  res.send('Hello! 👋🏻');
});

api.get('/token', (req, res) => {
  const key = process.env.KEY;
  const secret = process.env.SECRET;

  request.post('https://api.vasttrafik.se:443/token', {
    headers: {
      'Authorization': 'Basic ' + new Buffer(key + ':' + secret).toString('base64')
    },
    body: 'grant_type=client_credentials'
  }, (error, response, body) => {
    if (error) reject(error);

    const token = JSON.parse(body).access_token;
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ token: token }));
  });
});

api.get('*', (req, res) => {
  res.status(404).send('wat?');
});

api.listen(3000, () => {
  console.log('API up and running. 🎉');
});
