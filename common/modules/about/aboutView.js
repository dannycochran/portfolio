var Model = require('./aboutModel.js');

Portfolio.Views.About = module.exports = Backbone.View.extend({
  model: new Model(),
  tagName: 'ol',
  className: 'about',
  imageTemplate: _.template(require('./_image.html')),

  render: function () {
    if (!this.rendered) {
      this.rendered = true;

      _.each(this.model.images, function (image) {
        this.$el.append(this.imageTemplate({image: image}));
      }.bind(this));

      if ($.os.phone || $.os.tablet) this.$el.addClass('hover-off');
    }
    return this;
  },

  build: function () { return Portfolio.RESOLVE; }
});