var Interactions = require('../interactions/interactionsManager.js'),
    Posts = require('../posts/postsView.js');

Portfolio.Views.Blog = module.exports = Backbone.View.extend({
  model: new Backbone.Model(),
  className: 'blog',

  template: _.template(''),

  initialize: function () {
    Interactions.add(this, 'selectedPost', {
      callback: this.onInteractionSelectedPost.bind(this),
      initialValue: null
    });

    this.$el.html(this.template());
    this.posts = new Posts();
  },

  render: function () {
    if (!this.posts.rendered) {
      this.posts.render().rendered = true;
      this.$el.append(this.posts.el);
    }
    this.selectedPost(this.postId ? this.postId : null);
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

  scrollToPost: function (postId) {
    var $post = this.posts.$el.find('li[data-id="' + postId + '"]'),
        margin = Number($post.css('margin-top').replace('px', '')),
        scrollTop = $post.offset().top - this.posts.$el.offset().top - margin;
    this.posts.$el.scroll({scrollTop: scrollTop}, Portfolio.ANIMATION_DURATION);
  },

  build: function (postId) {
    this.postId = postId;
    return this.posts.build();
  },

  teardown: function () {
    this.posts.teardown();
  }
});
