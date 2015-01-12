var http = require('http'),
    express = require('express'),
    request = require('request'),
    tumblr = require('tumblr'),
    twitter = require('twitter'),
    util = require('util'),
    config = require('./configuration.json'),
    nodemailer = require('nodemailer');
    port = config.port;

var oauth = {
  consumer_key: config.tumblr.key,
  consumer_secret: config.tumblr.secret
};

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.email.from,
      pass: config.email.password
    }
});

var app = express(),
    blog = new tumblr.Blog(config.tumblr.url, oauth),
    tweets = new twitter({
      consumer_key: config.twitter.key,
      consumer_secret: config.twitter.secret,
      access_token_key: config.twitter.tokenKey,
      access_token_secret: config.twitter.tokenSecret
    });

app.configure(function () {
  app.use(express.compress());
  app.use(express.urlencoded());
  app.use(express.cookieParser());
  app.use(express.session({secret: config.secret}));
  app.use(express.static(__dirname + '/dist'));
  app.use(app.router);
});

app.get('/louie/posts', function (req, res) {
  blog.posts({limit: 25}, function(error, data) {
    if (error) throw new Error(error);
    else res.send(data.posts);
  });
});

app.get('/louie/microposts', function (req, res) {
  console.log('hihihi', req, res);
  tweets.get('/statuses/user_timeline.json', {include_entities:true}, function(data, error) {
    console.log('inside', data);
    if (error) throw new Error(error);
    else res.send(data);
  });
});

app.get('*', function (req, res) { res.sendfile('dist/index.html'); });

app.post('/email', function (req, res) {
  var mailOptions = {
    from: req.body.email,
    to: config.email.to,
    subject: 'Hello from ' + req.body.name + ' (' + req.body.email + ')',
    text: req.body.message
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error){
    if (error) {
      console.log('error', error);
      res.send('500');
    }
    else {
      console.log('successfully sent');
      res.send('200');
    }
  });
});

var httpServer = http.createServer(app).listen(port, function () {
  console.log('Portfolio web server listening on port ' + port);
});
