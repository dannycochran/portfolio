Portfolio.Models.Resume = Backbone.Model.extend({
  url: '/louie/resume',

  initialize: function () { this.once('sync', this.onHydrate); },

  hydrate: function () { this.fetch(); },

  isHydrated: function () { return this.has('education'); },

  onHydrate: function () { this.trigger('hydrate'); }
});