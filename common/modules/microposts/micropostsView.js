var Model = require('./micropostsCollection.js');

Portfolio.Views.Microposts = module.exports = Backbone.View.extend({
  tagName: 'ol',
  className: 'microposts',
  model: new Model(),

  template: _.template(require('./_microposts.html')),

  events: {'scroll': 'onScroll'},

  render: function () {
    this.model.each(this.renderMicropost.bind(this));

    this.lazyImageLoader = this.$el.find('img').unveil(0, function () {}, this.$el);
    this.lazyImageLoader.replaceDataSrc().start();

    this.boundOnScroll = _.debounce(this.lazyImageLoader.unveil.bind(this.lazyImageLoader), Portfolio.ANIMATION_DURATION);
    this.boundOnScroll();
    return this;
  },

  renderMicropost: function (model) {
    this.model.findLinks(model);
    this.$el.append(this.template({micropost: model}));
  },

  onScroll: function () { this.boundOnScroll(); },

  build: function () {
    return this.model.hydrate().then(function () {
      if (this.lazyImageLoader) this.lazyImageLoader.start();
    });
  },

  teardown: function () {
    this.lazyImageLoader.stop();
  }
});