var Model = require('./resumeModel.js');

Portfolio.Views.Resume = module.exports = Backbone.View.extend({
  tagName: 'ol',
  className: 'resume closed',
  template: _.template(require('./_resume.html')),
  model: new Model(),

  render: function () {
    if (this.$sections) return;

    this.$el.html(this.template({resume: this.model}));
    this.$sections = this.$el.find('div.section');

    return this;
  },

  build: function (callback) { return Ayasdi.RESOLVE; },

  teardown: function () {
    return new CaughtPromise(function (resolve, reject) {
      if (this.$el.hasClass('closed')) resolve();
      else this.$el.addClass('closed').one(Portfolio.transitionend, resolve);
    }.bind(this));
  }
});