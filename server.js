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
const DAY_MS = 24 * 60 * 60 * 1000;

const entity = {
  timestamp: 0,
  promise: Promise.resolve(),
  shouldRefresh: function() { return this.timestamp + DAY_MS < new Date().getTime(); },
  get: function() {
    if (this.shouldRefresh()) {
      this.timestamp = new Date().getTime();
      this.promise = this.fetch();
    }
    return this.promise;
  }
};

const posts = Object.assign({
  fetch: () => new Promise((resolve, reject) => {
    blog.posts({limit: 25}, (error, data) => resolve(error ? new Error(error) : data.posts));
  })
}, entity);

const microposts = Object.assign({
  fetch: () => new Promise((resolve, reject) => {
      tweets.get('/statuses/user_timeline.json', {include_entities:true}, (data, error) =>
        resolve(error ? new Error(error) : data));
  })
}, entity);

// Handlers.
app.get('/louie/posts', (req, res) => {
  posts.get().then(results => res.send(results));
});

app.get('/louie/microposts', (req, res) => {
  microposts.get().then(results => res.send(results));
});

app.get('/', sendIndex);
app.get('/*', sendIndex);

// Start the server
const server = app.listen(port, () => {
  console.log('App listening at http://%s:%s', server.address().address, port);
});