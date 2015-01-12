var HeadroomJS = require('../../vendor/js/headroom.js'),
    Interactions = require('../interactions/interactions.js');

Portfolio.Views.Navbar = module.exports = Backbone.View.extend({
  tagName: 'header',
  className: 'navbar',

  interactions: new Interactions(),
  template: _.template(require('./_navbar.html')),

  events: {
    'click header.single-post > header#portfolio-name': 'onShowAll',
    'click a': 'onTrackOutboundNavigation'
  },

  initialize: function () {
    this.interactions.add(this, 'singlePost', {
      callback: this.onInteractionSinglePost.bind(this),
      defaultValue: false
    });

    this.$el.html(this.template(this.model));
  },

  refreshHeadroom: function (view) {
    view.removeEventListener('touchstart');
    view.addEventListener('touchstart', function(event){});

    this.headroom = new Headroom(this.el, {
      tolerance: 1,
      offset: 20,
      classes: {unpinned: 'closed'},
      scroller: view
    }).init();
  },

  resetNavbar: function () {
    this.$el.removeClass('closed');
    this.$el.addClass('headroom--pinned');
  },

  onTrackOutboundNavigation: function (e) {
    mixpanel.track('Navigating to ' + $(e.currentTarget).attr('href'));
  },

  onInteractionSinglePost: function () {
    // do stuff
  },

  onShowAll: function () { this.singlePost(false); }

});