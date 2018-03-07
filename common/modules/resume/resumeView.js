import resumeHtml from './_resume.html';
var Model = require('./resumeModel.js');

Portfolio.Views.Resume = module.exports = Backbone.View.extend({
  tagName: 'ol',
  className: 'resume',
  template: _.template(resumeHtml),
  model: new Model(),

  render: function () {
    if (this.$sections) return this;

    this.$el.html(this.template({resume: this.model}));
    this.$sections = this.$el.find('div.section');

    return this;
  },

  build: function (callback) { return Promise.resolve(); }
});