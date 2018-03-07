import navbarHtml from './_navbar.html';

Portfolio.Views.Navbar = module.exports = Backbone.View.extend({
  tagName: 'header',
  className: 'navbar',
  template: _.template(navbarHtml),

  initialize: function () {
    this.$el.html(this.template(this.model));

    this.headroom = new Headroom(this.el, {
      tolerance: 1,
      offset: 20,
      classes: {unpinned: 'closed'},
    }).init();
  },

  updateScroller: function (view) { this.headroom.updateScroller(view); }
});