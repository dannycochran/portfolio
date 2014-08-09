Portfolio.Views.Slidebar = Backbone.View.extend({
  tagName: 'div',
  className: 'slidebar',

  template: _.template($('#slidebar-template').html()),

  events: {
    'click a': 'onClickNavigate'
  },

  initialize: function () { this.listenTo(this.model, 'navigate', this.onChangeArea); },

  render: function (view) {
    this.$el.html(this.template());
    this.$selector = this.$('#selector');

    this.$('#' + view).addClass('active');
    this.$selectedTarget = this.$('.active');
    $(window).resize(this.moveSelector.bind(this));
    $(window).keydown(_.debounce(this.arrowSelect, globals.duration).bind(this));
    this.moveSelector();
    return this;
  },

  onClickNavigate: function (e) {
    var $el = $(e.currentTarget);
    this.model.trigger('navigate', $el.attr('id'));
  },

  onChangeArea: function (view) {
    var $el = this.$el.find('a#' + view);
    this.$('.active').removeClass('active');
    $el.addClass('active');
    this.$selectedTarget = $el;
    this.moveSelector();
  },

  moveSelector: function () {
    this.$selector.css('left', this.$selectedTarget.offset().left);
  },

  arrowSelect: function (e) {
    var k = e.keyCode;
    if (k === 37 || k === 39) {
      var fakeEl = {},
          $next = this.$selectedTarget.next(),
          $prev = this.$selectedTarget.prev();
      if (k === 37 && $prev && $prev !== this.$selector) fakeEl.currentTarget = $prev.get(0);
      else if (k === 39 && $next) fakeEl.currentTarget = $next.get(0);
      if (fakeEl.currentTarget) this.selectArea(fakeEl);
    }
  }
});