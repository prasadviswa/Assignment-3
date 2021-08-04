const readline = require('readline'),
  savedata = require('./db_entry'),
  sd = require('./db_create');
const isValidHandle = require('./utility/utility');
const showdata = require('./db_create');
const PORT = process.env.PORT || 3001;
const express = require('express'),
  cors = require('cors'),
  app = express(),
  config = require('./config'),
  axios = require('axios');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question('\nEnter the Github handle below?\n\n', function (username) {
  console.log(`You have entered '${username}' .\n`);
  app.use(cors());
  // Validate user
  app.get('/api/auth', (req, res) => {
    apiurl = `https://api.github.com/users/${username}`;
    // console.log(isValidHandle(username));
    res.send(isValidHandle(username));
  });
  // Name of the Repos
  app.get('/api/repos', (req, res) => {
    axios({
      method: 'get',
      url: `https://api.github.com/users/${username}/repos`,
      headers: {
        Authorization: `Bearer ${config.githubToken}`,
        ContentType: `application/json`,
        Accept: `application/vnd.github.mercy-preview+json`,
      },
    })
      .then((response) => {
        res.send(Object.keys(response.data));
      })
      .catch((err) => {
        res.send(err);
      });
  });
  //  Count of the repos
  app.get('/api/repos/count', (req, res) => {
    axios({
      method: 'get',
      url: `https://api.github.com/users/${username}/repos`,
      headers: {
        Authorization: `Bearer ${config.githubToken}`,
        ContentType: `application/json`,
        Accept: `application/vnd.github.mercy-preview+json`,
      },
    })
      .then((response) => {
        // res.send(Object.keys(response.data).length);
        res.send(Object.keys(response.data).length);
      })
      .catch((err) => {
        res.send(err);
      });
  });
  app.get('/savedata', (req, res) => {
    savedata(username);
    res.send('Data inserted successfully');
  });
  app.get('/sd', (req, res) => {
    var sj = showdata();
    res.send(sj);
  });
  module.exports = app.listen(PORT, () => {
    console.log('Server running on port %d', PORT);
  });
  // module.exports = git;
  rl.close();
});
