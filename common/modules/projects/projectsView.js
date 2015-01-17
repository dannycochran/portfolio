var Model = require('./projectsModel.js');

Portfolio.Views.Projects = module.exports = Backbone.View.extend({
  tagName: 'ol',
  className: 'projects',
  template: _.template(require('./_project.html')),
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

  build: function () { return Portfolio.RESOLVE; }
});