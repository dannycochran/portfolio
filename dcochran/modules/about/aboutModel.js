Portfolio.Models.About = Backbone.Model.extend({
  url: '/louie/about',

  initialize: function () { this.once('sync', this.onHydrate); },

  hydrate: function () { this.fetch(); },

  isHydrated: function () { return this.has('things'); },

  onHydrate: function () { this.trigger('hydrate'); }
});