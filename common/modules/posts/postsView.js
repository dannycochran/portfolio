var Post = require('./postView.js'),
    Model = require('./postsCollection.js'),
    Interactions = require('../interactions/interactions.js');

Portfolio.Views.Posts = module.exports = Backbone.View.extend({
  model: new Model(),
  interactions: new Interactions(),

  tagName: 'ol',
  className: 'posts',
  name: 'posts',

  render: function () {
    this.model.each(this.renderPost.bind(this));
    return this;
  },

  renderPost: function (model) {
    var post = new Post({model: model});
    this.$el.append(post.el);
    post.render();
  },

  onPostSelected: function (model) {
    this.selectedPost = model;
    this.selectedPostTop = this.$el.find('#post' + this.selectedPost.get('id')).offset().top - 120;
    globals.app.model.trigger('show:posts', false);
    globals.router.navigate('home/' + model.get('id'), {trigger: false});
    mixpanel.track('Viewing single post' + model.get('id'));
  },

  showPosts: function (showPosts) {
    globals.router.navigate('home', {trigger: false});

    _.each(this.model.models, function (model) {
      if (model !== this.selectedPost) model.set('postHidden', !showPosts);
      else model.set('postHidden', false);
      model.set('selectedPost', false, {silent: true});
    }.bind(this));

    // _.delay(function () {
    //   var scrollTop = 0;
    //   if (showPosts) scrollTop = this.selectedPostTop;
    //   this.$el.scrollTop(scrollTop);
    // }.bind(this), 500);
  }
});