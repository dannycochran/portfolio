Portfolio.Views.Projects = Backbone.View.extend({
  tagName: 'ol',
  className: 'projects closed',
  name: 'projects',

  template: _.template($('#project-template').html()),

  events: {
  },

  render: function () {
    var projects = this.model.get('projects');
    this.model.set('scroller', this.el);

    if (this.$el.find('li.project').length === projects.length) return;

    _.each(this.model.get('projects'), function (project) {
      this.$el.append(this.template({project: project}));
    }.bind(this));

    return this;
  },

  build: function (callback) {
    if (this.model.isHydrated()) callback();
    else {
      this.listenToOnce(this.model, 'hydrate', callback);
      this.model.hydrate();
    }
  },

  teardown: function (callback) {
    callback();
  }
});