var Post = require('./postView.js'),
    Model = require('./postsCollection.js');

Portfolio.Views.Posts = module.exports = Backbone.View.extend({
  model: new Model(),

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
  }
});