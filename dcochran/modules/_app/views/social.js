Portfolio.Views.Social = Backbone.View.extend({
  tagName: 'div',
  className: 'social closed',
  name: 'home',

  template: _.template($('#social-template').html()),

  events: {
    'click div.toggle': 'toggleTwitter'
  },

  render: function () {
    if (this.posts && this.tweets) {
      this.setup();
      return;
    }

    this.posts = new Portfolio.Views.Posts({ model: this.model.posts });
    this.tweets = new Portfolio.Views.Tweets({ model: this.model.tweets });

    this.$el.html(this.template());
    this.$toggler = this.$('div.toggle');

    this.$el.append(this.posts.el);
    this.$el.append(this.tweets.el);

    this.posts.render();
    this.tweets.render();
    this.setup();

    this.model.set('scroller', this.posts.el);

    return this;
  },

  setup: function () {
    $(window).on('resize', this.onResize.bind(this));
    $(this.posts.el).on('scroll', this.onScroll.bind(this));
    $(this.tweets.el).on('scroll', this.onScroll.bind(this));
  },

  toggleTwitter: function (e) {
    mixpanel.track('Twitter sidebar toggled');
    this.tweets.$el.toggleClass('open');
    this.$toggler.toggleClass('open');
  },

  onScroll: function (e) {
    if (this.model.get('scroller') !== e.srcElement) this.model.set('scroller', e.srcElement);
  },

  onResize: function (e) {
    this.tweets.$el.removeClass('open');
    this.$toggler.removeClass('open');
  },

  build: function (callback) {
    if (this.model.isHydrated()) callback();
    else {
      this.listenToOnce(this.model, 'hydrate', callback);
      this.model.hydrate();
    }
  },

  teardown: function (callback) {
    $(window).off('scroll');
    $(window).off('resize', this.onResize);
    callback();
  }
});