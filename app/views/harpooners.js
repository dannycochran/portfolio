Portfolio.Views.Harpooners = Backbone.View.extend({
  model: Portfolio.Models.Game,

  HARPOONERS_HEIGHT: 130,
  HARPOONERS_WIDTH: 191,
  HARPOONERS_SCALE: 0.08,

  template: _.template($('#harpooners-template').html()),

  initialize: function () {
    this.listenTo(this.model, 'transform', this.naturalHarpoonersMovement);
  },

  render: function () {
    this.$el.html(this.template());
    return this;
  },

  activate: function (harpooners, dimensions) {
    this.oceanWidth = dimensions.width;
    this.OCEAN_HEIGHT = dimensions.height;
    this.START_Y = dimensions.startY;
    this.DURATION = dimensions.duration;
    this.transform = [[this.oceanWidth, this.START_Y], this.HARPOONERS_SCALE, 0, 0];


    this.$harpooners = harpooners;
    this.$innerHarpooners = this.$harpooners.append('g').classed('inner-harpooners', true);

    this.$el.children('g').children('path').forEach(function (path, i) {
      var $el = $(path);
      this.$innerHarpooners.append('path').attr({
        'fill': $el.attr('fill'),
        'd': $el.attr('d')
      });
    }.bind(this));

    this.transformHarpooners();
  },

  naturalHarpoonersMovement: function (obj) {
    // Move boat
    var harpooners = obj.wave.node(),
        p = harpooners.getPointAtLength(obj.interpolated * harpooners.getTotalLength()),
        diff = p.y - this.transform[3] < 0 ? 4 : 2;
    this.transform[3] = p.y; // keeps track of previous Y
    p.y = p.y - this.HARPOONERS_HEIGHT / 1.25;

    this.transform[0] = [p.x, p.y];
    this.transform[2] = diff;
    this.transformHarpooners();
  },

  transformHarpooners: function () {
    this.$innerHarpooners.attr({
      'transform': 'translate(' + this.transform[0][0] + ',' + this.transform[0][1] +
          ') scale(' + this.transform[1] + ') rotate(' + this.transform[2] + ')',
      'class': 'harpooners'
    });
  }
});
