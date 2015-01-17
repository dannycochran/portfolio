var HeadroomJS = require('../../vendor/js/headroom.js');

Portfolio.Views.Navbar = module.exports = Backbone.View.extend({
  tagName: 'header',
  className: 'navbar',
  template: _.template(require('./_navbar.html')),

  events: {'click a': 'onTrackOutboundNavigation'},

  initialize: function () {
    this.$el.html(this.template(this.model));

    this.headroom = new Headroom(this.el, {
      tolerance: 1,
      offset: 20,
      classes: {unpinned: 'closed'},
    }).init();
  },

  updateScroller: function (view) { this.headroom.updateScroller(view); },

  resetNavbar: function () {
    this.$el.removeClass('closed');
    this.$el.addClass('headroom--pinned');
  },

  onTrackOutboundNavigation: function (e) {
    mixpanel.track('Navigating to ' + $(e.currentTarget).attr('href'));
  }
});