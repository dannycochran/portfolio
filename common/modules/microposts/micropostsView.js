var Model = require('./micropostsCollection.js');

Portfolio.Views.Microposts = module.exports = Backbone.View.extend({
  tagName: 'ol',
  className: 'microposts',
  model: new Model(),

  template: _.template(require('./_microposts.html')),

  render: function () {
    this.model.each(this.model.findLinks.bind(this.model));
    this.$el.html(this.template({microposts: this.model.models}));
    return this;
  }
});