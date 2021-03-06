import projectHtml from './_project.html';

var Model = require('./projectsModel.js');

Portfolio.Views.Projects = module.exports = Backbone.View.extend({
  tagName: 'ol',
  className: 'projects',
  template: _.template(projectHtml),
  model: new Model(),

  render: function () {
    if (!this.rendered) {
      _.each(this.model.projects, function (project) {
        this.$el.append(this.template({project: project}));
      }.bind(this));

      this.rendered = true;
    }

    return this;
  },

  build: function () { return Promise.resolve(); }
});