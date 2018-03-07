import imageHtml from './_image.html';

var Model = require('./aboutModel.js');

Portfolio.Views.About = module.exports = Backbone.View.extend({
  model: new Model(),
  tagName: 'ol',
  className: 'about',
  imageTemplate: _.template(imageHtml),

  render: function () {
    if (!this.rendered) {
      this.rendered = true;

      _.each(this.model.images, function (image) {
        this.$el.append(this.imageTemplate({image: image}));
      }.bind(this));
    }
    return this;
  },

  build: function () { return Promise.resolve(); }
});