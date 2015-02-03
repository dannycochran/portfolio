var Model = require('./micropostsCollection.js');

Portfolio.Views.Microposts = module.exports = Backbone.View.extend({
  tagName: 'ol',
  className: 'microposts',
  model: new Model(),

  template: _.template(require('./_microposts.html')),

  render: function () {
    this.model.each(this.renderMicropost.bind(this));

    this.lazyImageLoader = this.$el.find('img').unveil(0, Portfolio.loadImageStyle, this.$el);
    this.lazyImageLoader.replaceDataSrc().start();

    _.defer(function () { this.lazyImageLoader.unveil(); }.bind(this));
    return this;
  },

  renderMicropost: function (model) {
    this.model.findLinks(model);
    this.$el.append(this.template({micropost: model}));
  },

  build: function () {
    return this.model.hydrate().then(function () {
      if (this.lazyImageLoader) this.lazyImageLoader.start();
    });
  },

  teardown: function () { this.lazyImageLoader.stop(); }
});