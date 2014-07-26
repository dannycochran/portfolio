Portfolio.Views.Whale = Backbone.View.extend({
  model: Portfolio.Models.Game,
  template: _.template($('#whale-template').html()),

  WHALE_WIDTH: 298,
  WHALE_HEIGHT: 113,
  WHALE_SCALE: 0.4,

  velocity: 0.025,
  buffer: 10,
  boost: 100,

  initialize: function () {
    // this.listenTo(this.model, 'transform', this.naturalWhaleMovement);
    this.listenTo(this.model, 'transform', this.mousemove);
  },

  render: function () {
    this.$el.html(this.template());
    return this;
  },

  activate: function (whale, dimensions) {
    this.oceanWidth = dimensions.width;
    this.OCEAN_HEIGHT = dimensions.height;
    this.START_Y = dimensions.startY;
    this.transform = [[this.oceanWidth/3, this.START_Y * 2], [this.WHALE_SCALE, this.WHALE_SCALE], 0];

    this.$whale = whale;
    this.$innerWhale = this.$whale.append('g').classed('inner-whale', true);

    this.$el.children('g').children('path').forEach(function (path, i) {
      var el = $(path);
      this.$innerWhale.append('path').attr({
        'fill': el.attr('fill'),
        'd': el.attr('d')
      });
    }.bind(this));

    this.transformWhale();
  },

  mousemove: function (obj) {
    var horizontal = 0, vertical = 0, currentTransform = this.transform[0],
        xDiff = 0, yDiff = 0, mouse = obj.mouse;

    if (mouse[0] <= 0 + this.buffer) { xDiff += -this.boost; }
    if (mouse[0] >= this.oceanWidth - this.buffer) xDiff += this.boost;
    if (mouse[1] <= 0 + this.buffer) yDiff += -this.boost;
    if (mouse[1] >= this.OCEAN_HEIGHT + this.WHALE_HEIGHT / 2 - this.buffer) yDiff += this.boost;

    // set direction of whale
    if (mouse[0] < this.transform[0][0] && !this.flipped) {
      this.transform[1][0] = -this.WHALE_SCALE;
      horizontal = this.WHALE_WIDTH;
      this.flipped = true;
    } else if (mouse[0] > this.transform[0][0] && this.flipped) {
      this.transform[1][0] = this.WHALE_SCALE;
      horizontal = -this.WHALE_WIDTH;
      this.flipped = false;
    }

    // Move whale towards mouse
    xDiff += mouse[0] - this.transform[0][0];
    yDiff += mouse[1] - this.transform[0][1] - this.WHALE_HEIGHT;

    horizontal += xDiff * this.velocity;
    vertical += yDiff * this.velocity;

    this.transform[0] = [currentTransform[0] + horizontal, currentTransform[1] + vertical];
    this.transformWhale();
  },

  transformWhale: function (duration) {
    var transitionType = this.$innerWhale;
    if (duration > 0) transitionType = this.$innerWhale.transition().duration(duration).ease('out-in');

    var x = this.transform[0][0], y = this.transform[0][1];
    if (!this.flipped) {
      if (x >= this.oceanWidth - this.WHALE_WIDTH) x = this.oceanWidth - this.WHALE_WIDTH;
      if (x <= 0) x = 0;
    } else {
      if (x > this.oceanWidth + this.WHALE_WIDTH) x = this.oceanWidth + this.WHALE_WIDTH;
      if (x <= this.WHALE_WIDTH) x = this.WHALE_WIDTH;
    }
    if (y > this.OCEAN_HEIGHT + this.WHALE_HEIGHT/2) y = this.OCEAN_HEIGHT + this.WHALE_HEIGHT/2;
    if (y < this.START_Y - this.WHALE_HEIGHT) y = this.START_Y - this.WHALE_HEIGHT;

    this.transform[0] = [x, y];
    transitionType.attr({
      'transform': 'translate(' + this.transform[0][0] + ',' + this.transform[0][1] +
        ') scale(' + this.transform[1][0] + ' ' + this.transform[1][1] + ') rotate(' + this.transform[2] + ')'
    });
  }
});
