Portfolio.Models.Social = Backbone.Model.extend({
  name: 'social',

  initialize: function () {
    this.posts = new Portfolio.Models.Posts();
    this.tweets = new Portfolio.Models.Tweets();

    this.listenTo(this.posts, 'hydrate', this.onHydrate);
    this.listenTo(this.tweets, 'hydrate', this.onHydrate);
  },

  hydrate: function () {
    if (!this.isHydrated()) {
      if (!this.posts.isHydrated()) this.posts.hydrate();
      if (!this.tweets.isHydrated()) this.tweets.hydrate();
    } else {
      this.onHydrate();
    }
  },

  onHydrate: function () {
    if (this.isHydrated()) {
      this.trigger('hydrate');
    }
  },
  
  isHydrated: function () {
    return this.posts.isHydrated() && this.tweets.isHydrated();
  }
});
