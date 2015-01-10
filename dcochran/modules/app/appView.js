
var MobyDick = require('dannycochran/mobydick');
    // Home = require('../home/homeView.js'),
    // Navbar = require('../navbar/navbar.js'),
    // Slidebar = require('../slidebar/slidebar.js');

DC.Views.App = module.exports = Backbone.View.extend({
  el: 'body',

  initialize: function() {
    this.game = new MobyDick();
    // this.home = new Home({ model: this.model });
    // this.navbar = new Navbar({ model: this.model });
    // this.slidebar = new Slidebar({ model: this.model });

    // this.listenTo(this.slidebar, 'navigate', this.changeArea);
    // this.listenTo(this.home, 'headroom', this.refreshHeadroom);
    // this.listenTo(this.model, 'show:posts', this.onShowPosts);
    // this.listenTo(this.model, 'navigate', this.onChangeArea);
  },

  renderGame: function () {
    this.game.build().render();
  },

  refreshHeadroom: function (el) {
    this.navbar.refreshHeadroom(el);
  },

  onShowPosts: function (showPosts) {
    this.slidebar.$el.toggleClass('closed', !showPosts);
    this.navbar.$el
      .toggleClass('single-post', !showPosts)
      .addClass('headroom-pinned')
      .removeClass('closed');
    this.home.social.posts.showPosts(showPosts);
  },

  onChangeArea: function (view) {
    this.home.render(view);
  },

  render: function (view) {
    if (view !== 'home' && view !== 'resume' && view !== 'projects' && view !== 'about') view = 'home';

    this.$el.empty();

    this.$el.append(this.navbar.el);
    this.navbar.render();

    this.$el.append(this.home.el);
    this.home.render(view);

    this.$el.append(this.slidebar.el);
    this.slidebar.render(view);

    Portfolio.router.navigate(view, {trigger: false});

    var randomUserId = null;
    if (!localStorage.getItem('randomUserId')) {
      randomUserId = guid();
      localStorage.setItem('randomUserId', randomUserId);
    } else {
      randomUserId = localStorage.getItem('randomUserId');
    }

    if (randomUserId === null) mixpanel.identify();
    else mixpanel.identify(randomUserId);
  }
});