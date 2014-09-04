Portfolio.Views.Harpooners = Backbone.View.extend({
  model: Portfolio.Models.Game,

  template: _.template($('#harpooners-template').html()),

  initialize: function () {
    this.listenTo(this.model, 'transform', this.naturalHarpoonersMovement);
    this.listenTo(this.model, 'resize', this.onResize);
    this.listenTo(this.model, 'teardown', this.teardown);
  },

  render: function () {
    this.$el.html(this.template());
    return this;
  },

  activate: function (harpooners, dimensions) {
    this.oceanWidth = dimensions.width;
    this.startY = dimensions.startY;
    this.DURATION = dimensions.duration;
    this.transform = [[this.oceanWidth, this.startY], this.getScale(this.oceanWidth), 0, 0];

    this.$harpooners = harpooners;
    this.$innerHarpooners = this.$harpooners.append('g').classed('inner-harpooners', true);

    this.$el.children('g').children('path').forEach(function (path, i) {
      var $el = $(path);
      this.$innerHarpooners.append('path').attr({
        'fill': $el.attr('fill'),
        'd': $el.attr('d')
      });
    }.bind(this));

    this.transformHarpooners(0);
  },

  naturalHarpoonersMovement: function (obj) {
    // Move harpooners
    var height = this.$innerHarpooners.node().getBBox().height * this.transform[1],
        harpooners = obj.wave.node(),
        p = harpooners.getPointAtLength(obj.interpolated * harpooners.getTotalLength()),
        diff = p.y - this.transform[3] < 0 ? 4 : 2;
    this.transform[3] = p.y; // keeps track of previous Y
    p.y = p.y - height / 1.1;

    this.transform[0] = [p.x, p.y];
    this.transform[2] = diff;
    this.transformHarpooners(obj.duration);
  },

  transformHarpooners: function (duration) {
    this.$innerHarpooners.transition().duration(duration).attr({
      'transform': 'translate(' + this.transform[0][0] + ',' + this.transform[0][1] +
          ') scale(' + this.transform[1] + ') rotate(' + this.transform[2] + ')',
      'class': 'harpooners'
    });
  },

  onResize: function (newWidth) {
    var oldTransform = this.transform[1], newTransform = this.getScale(newWidth);
    this.transform[1] = newTransform;
  },

  getScale: function (width) { return width * 0.00008; },

  teardown: function () {
    this.stopListening(this.model);
    this.remove();
  }
});
