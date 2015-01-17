Portfolio.Views.Slidebar = module.exports = Backbone.View.extend({
  className: 'slidebar',
  template: _.template(require('./_slidebar.html')),

  initialize: function (options) {
    this.$el.html(this.template({sections: options.sections}));
    this.$selector = this.$('#selector');
  },

  render: function () { this.moveSelector(); },

  changeSection: function (section) {
    this.$('.active').removeClass('active');
    this.$selectedTarget = this.$el.find('a#' + section).addClass('active');

    this.moveSelector();
  },

  moveSelector: function () {
    var previousLeft = Number(this.$selector.css('left').replace('px', '')),
        newLeft = this.$selectedTarget.offset().left - this.$el.offset().left;

    this.direction = newLeft - previousLeft > 0 ? 'left' : 'right';
    this.opposite = newLeft - previousLeft < 0 ? 'left' : 'right';
    this.$selector.css('left', newLeft);
  },

  onResize: function () { this.moveSelector(); },
});