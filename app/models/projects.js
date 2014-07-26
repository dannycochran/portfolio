Portfolio.Models.Projects = Backbone.Model.extend({
  url: '/louie/projects',

  initialize: function () { this.once('sync', this.onHydrate); },

  hydrate: function () { this.fetch(); },

  isHydrated: function () { return this.has('projects'); },

  onHydrate: function () { this.trigger('hydrate'); }
});