Portfolio.Models.Posts = Backbone.Collection.extend({
  url: '/louie/posts',
  model: Portfolio.Models.Post,

  initialize: function () { this.once('sync', this.onHydrate); },

  hydrate: function () { this.fetch(); },

  isHydrated: function () { return this.models.length > 0 ? true : false; },

  onHydrate: function () {
    this.trigger('hydrate');
  }
});