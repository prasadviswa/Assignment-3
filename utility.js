require('http');
require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';
const axios = require('axios');
const config = require('../config');
const { Octokit } = require('@octokit/rest');

let repocount;
let isHandleValid;
const isValidHandle = async (username, callback) => {
  await axios({
    method: 'get',
    url: `https://api.github.com/users/${username}`,
    headers: {
      Authorization: `Bearer ${config.githubToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.mercy-preview+json',
    },
  })
    .then((response) => {
      let login = response.data.login;
      callback(null, login);
    })
    .catch((err) => {
      console.log('Invalid user');
      callback(err, null);
    });
  if (isHandleValid !== 0) {
    callback(null, login);
  } else {
    callback(null, null);
  }
};

const hasRepo = async (username, callback = null) => {
  await axios({
    method: 'get',
    url: `https://api.github.com/users/${username}/repos`,
    headers: {
      Authorization: `Bearer ${config.githubToken}`,
      ContentType: `application/json`,
      Accept: `application/vnd.github.mercy-preview+json`,
    },
  })
    .then((response) => {
      repocount = Object.keys(response.data).length;
      if (repocount != 0) {
        return true;
      } else {
        console.log('Given handle doesnt have any repositories');
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});
const createRepo = async (new_repo, callback) => {
  const res = await octokit.repos.createForAuthenticatedUser({
    name: new_repo,
  });
  if (res.status == 201) {
    callback(null, true);
  } else {
    callback('Error', false);
  }
};

const listOfRepos = async (uname, callback) => {
  const { data: reference } = await octokit.request(
    'GET /users/{username}/repos',
    {
      username: uname,
    }
  );
  repos = [];
  reference.forEach((element) => {
    repos.push(element.name);
  });
  callback(null, repos);
};

const hasBranch = async (username, reponame, callback) => {
  const { data: reference } = await octokit.request(
    'GET /repos/{owner}/{repo}/git/refs/head',
    {
      owner: username,
      repo: reponame,
    }
  );
  if (reference.length > 1) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const createBranch = async (uname, reponame, newbranch, callback) => {
  const { data: reference } = await octokit.request(
    'GET /repos/{owner}/{repo}/git/refs/head',
    {
      owner: uname,
      repo: reponame,
    }
  );

  reference.forEach((element) => {
    if (element.ref === 'refs/heads/main') {
      sha_branch_from = element.object.sha;
    }
  });

  const response = await octokit.request(
    'POST /repos/{owner}/{repo}/git/refs',
    {
      owner: uname,
      repo: reponame,
      ref: `refs/heads/${newbranch}`,
      sha: sha_branch_from,
    }
  );
  console.log(response);
  if (response.status === 201) {
    console.log(newbranch);
    callback(null, newbranch);
  } else {
    console.log('error');
    callback(null, null);
  }
};

const listBranch = async (uname, reponame, callback) => {
  const { data: user } = await octokit.request('GET /user');
  console.log(`Authenticated as ${user.login}`);

  const response = await octokit.request('GET /repos/{owner}/{repo}/branches', {
    owner: uname,
    repo: reponame,
  });
  branches = [];
  response.data.forEach((element) => {
    branches.append(element.name);
  });
  callback(null, branches);
};

var showTree = () => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db('nodedb');
    dbo.collection('nodejs').findOne({}, function (err, result) {
      if (err) throw err;
      console.log(result.name);
      db.close();
      return result.name;
    });
  });
};

var saveTree = (uname) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db('nodedb');
    var myobj = { name: `${uname}`, address: 'Highway 37' };
    dbo.collection('nodejs').insertOne(myobj, function (err, res) {
      if (err) throw err;
      console.log('1 document inserted');
      db.close();
    });
  });
};

module.exports = createRepo;
module.exports = listOfRepos;
module.exports = createBranch;
module.exports = listBranch;
module.exports = saveTree;
module.exports = showTree;
module.exports = isValidHandle;
module.exports = hasRepo;
module.exports = hasBranch;
