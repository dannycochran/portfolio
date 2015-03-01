var Interactions = require('../interactions/interactionsManager.js'),
    Microposts = require('../microposts/micropostsView.js');
    Posts = require('../posts/postsView.js');

Portfolio.Views.Home = module.exports = Backbone.View.extend({
  model: new Backbone.Model(),
  className: 'home',

  template: _.template(require('./_home.html')),
  events: {'click div.toggle': 'onToggleMicroposts'},

  initialize: function () {
    Interactions.add(this, 'selectedPost', {
      callback: this.onInteractionSelectedPost.bind(this),
      initialValue: null
    });
    Interactions.add(this, 'toggleMicroposts', {callback: this.onInteractionToggleMicroposts.bind(this)});

    this.$el.html(this.template());
    this.$toggler = this.$('div.toggle');

    this.posts = new Posts();
    this.microposts = new Microposts();
  },

  render: function () {
    if (!this.posts.rendered) {
      this.posts.render().rendered = true;
      this.$el.append(this.posts.el);
    }
    this.selectedPost(this.postId ? this.postId : null);

    if (!this.microposts.rendered) {
      this.microposts.render().rendered = true;
      this.$el.append(this.microposts.el);
    }
    return this;
  },

  onInteractionSelectedPost: function () {
    if (!this.selectedPost() && this.selectedPost.previous()) {
      _.defer(function () { this.scrollToPost(this.selectedPost.previous()); }.bind(this));
      this.posts.$el.find('li.post').data('display', null);
    } else if (this.selectedPost()) {
      this.posts.$el.scrollTop(0);
      this.posts.$el.find('li.post').data('display', 'none');
      this.posts.$el.find('li.post[data-id="' + this.selectedPost() + '"]').data('display', null);
    }
  },

  onInteractionToggleMicroposts: function () {
    this.$toggler.toggleClass('open', this.toggleMicroposts());
    mixpanel.track('Microposts sidebar toggled');
  },

  onToggleMicroposts: function (e) { this.toggleMicroposts(!this.toggleMicroposts()); },

  onResize: function (e) { this.toggleMicroposts(false); },

  scrollToPost: function (postId) {
    var $post = this.posts.$el.find('li[data-id="' + postId + '"]'),
        margin = Number($post.css('margin-top').replace('px', '')),
        scrollTop = $post.offset().top - this.posts.$el.offset().top - margin;
    if (!Portfolio.isMobile) this.posts.$el.scroll({scrollTop: scrollTop}, Portfolio.ANIMATION_DURATION);
    else this.posts.$el.scrollTop(scrollTop);
  },

  build: function (postId) {
    this.postId = postId;
    return CaughtPromise.all([this.posts.build(), this.microposts.build()]);
  },

  teardown: function () {
    this.posts.teardown();
    this.microposts.teardown();
  }
});
