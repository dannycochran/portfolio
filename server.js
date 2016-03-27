'use strict';

const express = require('express');
const tumblr = require('tumblr');
const twitter = require('twitter');
const app = express();
const config = require('./configuration.json');
const port = config.port;

const blog = new tumblr.Blog(config.tumblr.url, {
  consumer_key: config.tumblr.key,
  consumer_secret: config.tumblr.secret
});

const tweets = new twitter({
  consumer_key: config.twitter.key,
  consumer_secret: config.twitter.secret,
  access_token_key: config.twitter.tokenKey,
  access_token_secret: config.twitter.tokenSecret
});

const sendIndex = (req, res) => res.status(200).sendfile('dist/index.html');

// Serve static assets.
app.use(express.compress());
app.use(express.urlencoded());
app.use('/dist', express.static('dist'));

// Daily caching of data.
const oneDay = 24 * 60 * 60 * 1000;
const lastFetched = new Date().getTime();
const shouldRefresh = () => lastFetched + oneDay < new Date().getTime();

// These data will be cached for up to one day.
let posts;
let microposts;

const getMicroposts = function(shouldRefresh) {
  function fetchMicroposts() {
    return new Promise((resolve, reject) => {
      tweets.get('/statuses/user_timeline.json', {include_entities:true}, (data, error) =>
        resolve(error ? new Error(error) : data));
    });
  }

  if (shouldRefresh || !microposts) microposts = fetchMicroposts();

  return microposts;
};

const getPosts = function(shouldRefresh) {
  function fetchPosts() {
    return new Promise((resolve, reject) => {
      blog.posts({limit: 25}, (error, data) => resolve(error ? new Error(error) : data.posts));
    });
  }

  if (shouldRefresh || !posts) posts = fetchPosts();

  return posts;
};

// Handlers.
app.get('/louie/posts', (req, res) => {
  getPosts(shouldRefresh()).then(results => res.send(results));
});

app.get('/louie/microposts', (req, res) => {
  getMicroposts(shouldRefresh()).then(results => res.send(results));
});

app.get('/', sendIndex);
app.get('/*', sendIndex);

// Start the server
const server = app.listen(port, () => {
  console.log('App listening at http://%s:%s', server.address().address, port);
});