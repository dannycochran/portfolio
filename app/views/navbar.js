Portfolio.Views.Navbar = Backbone.View.extend({
  tagName: 'header',
  className: 'navbar',

  template: _.template($('#navbar-template').html()),

  events: {
    'click header#portfolio-name': 'onShowAll',
    'click a': 'onTrackOutwardNavigation'
  },

  render: function () {
    this.$el.html(this.template(this.model));
    return this;
  },

  refreshHeadroom: function (view) {
    view.get('scroller').addEventListener('touchstart', function(event){});

    this.headroom = new Headroom(this.el, {
      'tolerance': 1,
      'offset': 20,
      'classes': {
        'unpinned': 'closed'
      },
      'scroller': view.get('scroller')
    }).init();
  },

  resetNavbar: function () {
    this.$el.removeClass('closed');
    this.$el.addClass('headroom--pinned');
  },

  onTrackOutwardNavigation: function (e) {
    mixpanel.track('Navigating to ' + $(e.currentTarget).attr('href'));
  },

  onShowAll: function () {
    if (this.$el.hasClass('single-post')) {
      this.model.trigger('show:posts', true);
    } else {
      this.model.trigger('navigate', 'home');
    }
  }

});