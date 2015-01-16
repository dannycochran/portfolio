var Interactions = require('../interactions/interactions.js'),
    Microposts = require('../microposts/micropostsView.js');
    Posts = require('../posts/postsView.js');

Portfolio.Views.Home = module.exports = Backbone.View.extend({
  model: new Backbone.Model(),
  interactions: new Interactions(),
  className: 'home closed',

  template: _.template(require('./_home.html')),
  events: {'click div.toggle': 'onToggleMicroposts'},

  initialize: function () {
    this.interactions.add(this, 'selectedPost', {
      callback: this.onInteractionSelectedPost.bind(this),
      initialValue: null
    });
    this.interactions.add(this, 'toggleMicroposts', {callback: this.onInteractionToggleMicroposts.bind(this)});

    this.$el.html(this.template());
    this.$toggler = this.$('div.toggle');

    this.posts = new Posts();
    this.microposts = new Microposts();
  },

  render: function () {
    this.selectedPost(null);

    if (!this.posts.rendered) {
      this.posts.render().rendered = true;
      this.$el.append(this.posts.el);
    }
    if (!this.microposts.rendered) {
      this.microposts.render().rendered = true;
      this.$el.append(this.microposts.el);
    }

    return this;
  },

  renderSubSection: function (modelId) {
    if (this.posts.model.get(modelId)) this.selectedPost(modelId);
    if (modelId) this.toggleMicroposts(false);
  },

  onInteractionSelectedPost: function () {
    if (!this.selectedPost()) {
      this.posts.$el.find('li').show();
    } else {
      this.posts.$el.find('li').hide();
      this.posts.$el.find('li[data-id="' + this.selectedPost() + '"]').show();
    }
  },

  onInteractionToggleMicroposts: function () {
    this.$toggler.toggleClass('open', this.toggleMicroposts());
    mixpanel.track('Microposts sidebar toggled');
  },

  onToggleMicroposts: function (e) { this.toggleMicroposts(!this.toggleMicroposts()); },

  onResize: function (e) { this.toggleMicroposts(false); },

  build: function () {
    return CaughtPromise.all([this.posts.model.hydrate(), this.microposts.model.hydrate()]);
  },

  teardown: function () {
    this.stopListening();
    return new CaughtPromise(function (resolve, reject) {
      if (this.$el.hasClass('closed')) resolve();
      else this.$el.addClass('closed').one(Portfolio.transitionend, resolve);
    }.bind(this));
  }
});