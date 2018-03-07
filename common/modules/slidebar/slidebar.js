import slideBarHtml from './_slidebar.html';

Portfolio.Views.Slidebar = module.exports = Backbone.View.extend({
  className: 'slidebar',
  template: _.template(slideBarHtml),

  initialize: function (options) {
    this.$el.html(this.template({sections: options.sections}));
    this.$selector = this.$('#selector');
    this.$selectedTarget = this.$el.find('a').first();
  },

  render: function (section) {
    if (!section) section = this.$selectedTarget.attr('id');
    this.$('.active').removeClass('active');
    this.$selectedTarget = this.$el.find('a#' + section).addClass('active');

    this.selectorHidden = false;
    this.moveSelector();
  },

  hideSelector: function () {
    this.selectorHidden = true;
    this.$selectedTarget.removeClass('active');
    this.$selector.css('left', -this.$selector.width());
  },

  moveSelector: function () {
    if (this.selectorHidden) return;
    var previousLeft = Number(this.$selector.css('left').replace('px', '')),
        newLeft = this.$selectedTarget.offset().left - this.$el.offset().left;

    this.direction = newLeft - previousLeft > 0 ? 'left' : 'right';
    this.opposite = newLeft - previousLeft < 0 ? 'left' : 'right';
    this.$selector.css('left', newLeft);
  },

  onResize: function () { this.moveSelector(); },
});