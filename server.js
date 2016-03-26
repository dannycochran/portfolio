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

const sendIndex = (req, res) => { res.status(200).sendfile('dist/index.html'); };

// Serve static assets.
app.use('/dist', express.static('dist'));
app.use(express.compress());
app.use(express.urlencoded());

// Handlers.
app.get('/louie/posts', (req, res) => {
  blog.posts({limit: 25}, function(error, data) {
    if (error) throw new Error(error);
    else res.send(data.posts);
  });
});

app.get('/louie/microposts', (req, res) => {
  tweets.get('/statuses/user_timeline.json', {include_entities:true}, function(data, error) {
    if (error) throw new Error(error);
    else res.send(data);
  });
});

app.get('/', sendIndex);
app.get('/*', sendIndex);

// Start the server
const server = app.listen(port, () => {
  console.log('App listening at http://%s:%s', server.address().address, port);
});