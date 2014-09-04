Portfolio.Views.Whale = Backbone.View.extend({
  model: Portfolio.Models.Game,
  template: _.template($('#whale-template').html()),
  tail: _.template($('#whale-tail').html()),

  MIN_SPLASH_SPEED: 20,
  buffer: 10,
  boost: 100,
  yBuffer: [],
  bufferLength: 50,
  flipped: false,
  tailUp: false,

  initialize: function () {
    this.listenTo(this.model, 'transform', this.mousemove);
    this.listenTo(this.model, 'resize', this.onResize);
    this.listenTo(this.model, 'teardown', this.teardown);
  },

  render: function () {
    this.$el.html(this.template());

    var fakeDom = document.createDocumentFragment();
    $(fakeDom).html(this.tail());

    this.tailDownPath = $(fakeDom).children().first().attr('d');
    this.tailUpPath = $(fakeDom).children().last().attr('d');

    return this;
  },

  activate: function (whale, dimensions) {
    this.oceanWidth = dimensions.width;
    this.oceanHeight = dimensions.height;
    this.startY = dimensions.startY;
    this.whaleScale = this.getScale(this.oceanWidth);
    this.transform = [[this.oceanWidth/3, this.startY * 2], [this.whaleScale, this.whaleScale], 0];
    this.velocity = this.oceanWidth * 0.000025;

    this.$whale = whale;
    this.$innerWhale = this.$whale.append('g').classed('inner-whale', true);

    this.$el.children('g').children('path').forEach(function (path, i) {
      var el = $(path);
      this.$innerWhale.append('path').attr({
        'fill': el.attr('fill'),
        'd': el.attr('d'),
        'id': el.attr('id')
      });
    }.bind(this));

    this.whaleWidth = this.$innerWhale.node().getBBox().width * this.whaleScale;
    this.whaleHeight = this.$innerWhale.node().getBBox().height * this.whaleScale;

    this.setVelocityScale();
    this.transformWhale([0,0], 0);

  },

  mousemove: function (obj) {
    var horizontal = 0, vertical = 0, currentTransform = this.transform[0],
        xDiff = 0, yDiff = 0, mouse = obj.mouse;

    if (mouse[0] <= 0 + this.buffer) { xDiff += -this.boost; }
    if (mouse[0] >= this.oceanWidth - this.buffer) xDiff += this.boost;
    if (mouse[1] <= 0 + this.buffer) yDiff += -this.boost;
    if (mouse[1] >= this.oceanHeight + this.whaleHeight / 2 - this.buffer) yDiff += this.boost;

    // set direction of whale
    if (mouse[0] < this.transform[0][0] && !this.flipped) {
      this.transform[1][0] = -this.whaleScale;
      horizontal = this.whaleWidth;
      this.flipped = true;
    } else if (mouse[0] > this.transform[0][0] && this.flipped) {
      this.transform[1][0] = this.whaleScale;
      horizontal = -this.whaleWidth;
      this.flipped = false;
    }

    // Move whale towards mouse
    xDiff += mouse[0] - this.transform[0][0];
    yDiff += mouse[1] - this.transform[0][1] - this.whaleHeight;

    horizontal += xDiff * this.velocity;
    vertical += yDiff * this.velocity;

    this.transform[0] = [currentTransform[0] + horizontal, currentTransform[1] + vertical];
    this.transformWhale(mouse, 40);
  },

  checkForSplash: function (x, y, velocity) {
    this.yBuffer.push(y);

    // determine if a splash should happen
    var l = this.yBuffer.length - 1, minY = this.startY - this.whaleHeight + 10;

    if (Math.abs(Math.abs(this.yBuffer[l]) - Math.abs(this.yBuffer[0])) > this.MIN_SPLASH_SPEED && y < minY) {
      this.yBuffer = [];
      var extra = this.flipped ? -this.whaleWidth : this.whaleWidth;
      this.model.trigger('splash', {x: x + extra, velocity: velocity, whaleScale: this.whaleScale});
    }

    // reset the buffer at this.bufferLength
    if (this.yBuffer.length > this.bufferLength) this.yBuffer.shift();
  },

  transformWhaleTail: function (velocity) {
    if (this.animating) return;
    this.animating = true;
    var tailPos = this.tailUp ? this.tailDownPath : this.tailUpPath;
    this.tailUp = !this.tailUp;

    this.$innerWhale.select('path#mainBody').transition().duration(velocity).attr({d: tailPos});
    _.delay(function () { this.animating = false; }.bind(this), velocity);
  },

  transformWhale: function (mouse, duration) {
    var x = this.transform[0][0], y = this.transform[0][1], distance, velocity;

    // make sure whale does not move beyond x-region
    // console.log('x', x, 'oceanWidth', this.oceanWidth, 'whaleWidth', this.whaleWidth, this.whaleScale);
    if (!this.flipped) {
      if (x >= this.oceanWidth - this.whaleWidth) x = this.oceanWidth - this.whaleWidth;
      if (x <= 0) x = 0;
    } else {
      if (x > this.oceanWidth + this.whaleWidth) x = this.oceanWidth + this.whaleWidth;
      if (x <= this.whaleWidth) x = this.whaleWidth;
    }
    // make sure whale does not move beyond y-region
    if (y > this.oceanHeight + this.whaleHeight * 1.5) y = this.oceanHeight + this.whaleHeight * 1.5;
    if (y < this.startY - this.whaleHeight) y = this.startY - this.whaleHeight;

    this.transform[0] = [x, y];

    // rotate the whale depending on the mouse heading
    if (y + this.whaleHeight + this.whaleHeight / 2 < mouse[1]) this.transform[2] = 15;
    else if (y + this.whaleHeight - this.whaleHeight / 2 > mouse[1]) this.transform[2] = -15;
    else this.transform[2] = 0;

    // calculate velocity
    distance = Math.sqrt(Math.pow((x - mouse[0]), 2) + Math.pow((y - mouse[1]), 2));
    velocity = this.velocityScale(distance);

    this.transformWhaleTail(velocity);
    this.checkForSplash(x, y, velocity);
    this.$innerWhale.transition().duration(duration).attr({
      'transform': 'translate(' + this.transform[0][0] + ',' + this.transform[0][1] +
        ') scale(' + this.transform[1][0] + ' ' + this.transform[1][1] + ') rotate(' + this.transform[2] + ')'
    });
  },

  onResize: function (newWidth) {
    this.velocity = this.oceanWidth * 0.000025;
    this.oceanWidth = newWidth;
    this.whaleScale = this.getScale(newWidth);
    this.transform[1] = [this.whaleScale, this.whaleScale];
    this.flipped = false;

    this.setVelocityScale();
    this.whaleWidth = this.$innerWhale.node().getBBox().width * this.whaleScale;
    this.whaleHeight = this.$innerWhale.node().getBBox().height * this.whaleScale;
  },

  setVelocityScale: function () {
    this.velocityScale = d3.scale.linear().domain([0.1 * this.oceanWidth, 0.3 * this.oceanWidth]).range([1000, 100]).clamp(true);
  },

  getScale: function (width) { return width * 0.0003; },

  teardown: function () {
    this.stopListening(this.model);
    this.remove();
  }
});
