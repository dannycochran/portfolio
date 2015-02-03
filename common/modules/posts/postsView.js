var Post = require('./postView.js'),
    Model = require('./postsCollection.js');

Portfolio.Views.Posts = module.exports = Backbone.View.extend({
  model: new Model(),

  tagName: 'ol',
  className: 'posts',
  name: 'posts',

  render: function () {
    this.model.each(this.renderPost.bind(this));
    this.lazyImageLoader = this.$el.find('img, param').unveil(0, function () {}, this.$el);
    this.lazyImageLoader.replaceDataSrc().start();

    _.defer(function () { this.lazyImageLoader.unveil(); }.bind(this));
    return this;
  },

  renderPost: function (model) {
    var post = new Post({model: model});
    this.$el.append(post.el);
    post.render();
  },

  build: function () {
    return this.model.hydrate().then(function () {
      if (this.lazyImageLoader) this.lazyImageLoader.start();
    }.bind(this));
  },

  teardown: function () { this.lazyImageLoader.stop(); }
});