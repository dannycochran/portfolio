Portfolio.Models.Tweets = Backbone.Collection.extend({
  url: '/louie/tweets',
  model: Portfolio.Models.Tweet,

  initialize: function () { this.once('sync', this.onHydrate); },

  hydrate: function () { this.fetch(); },

  isHydrated: function () { return this.models.length > 0 ? true : false; },

  onHydrate: function () { this.trigger('hydrate'); }
});