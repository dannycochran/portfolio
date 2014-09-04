Portfolio.Views.Splash = Backbone.View.extend({
  NUM_SPLASHES: 10,
  SPLASH_DISTANCE: 100,
  SPLASH_HEIGHT: 240,

  startProgress: 0.01,
  factor: 0.01,

  initialize: function () {
    this.listenTo(this.model, 'splash', this.onNewSplash);
    this.listenTo(this.model, 'teardown', this.teardown);
  },

  activate: function ($splash, dimensions) {
    this.$splash = $splash;
    this.dimensions = dimensions;

    this.line = d3.svg.line().interpolate('basis');

    this.oceanWidth = dimensions.width;
    this.OCEAN_HEIGHT = dimensions.height;
    this.START_Y = dimensions.startY;
  },

  onNewSplash: function (obj) {
    var pellets = [], uniqueId = _.uniqueId('pg');
    this.maxRadius = obj.whaleScale * 50;
    this.minRadius = obj.whaleScale * 20;
    for (var i = 0; i < this.NUM_SPLASHES; i++) pellets.push([0, 0, this.getRandomRadius()]);

    _.each(pellets, function(pellet, i) {
      var group = this.$splash.append('g').classed('pelletGroup ' + uniqueId, true);

      group.attr({
        'transform': 'translate(' + obj.x + ' ' + this.START_Y + ')',
        id: 'pellet' + i
      });

      group.append('circle').attr({
        cx: pellets[i][0],
        cy: pellets[i][1],
        r: pellets[i][2],
        class: 'pellet'
      });

      var randomY = this.getRandomY(obj.velocity);
      group.append('path').attr({
        d: this.line(this.generatePelletPath(pellets[i], randomY)),
        highestPoint: randomY
      });
    }, this);

    var $pellets = d3.selectAll('g.' + uniqueId);
    this.splash($pellets);
  },

  splash: function ($pellets) {
    var progress = this.startProgress, factor = this.factor, that = this;

    var movePellets = function () {
      $pellets.each(function(group) {
        var $el = d3.select(this),
            $pellet = $el.select('circle'),
            $path = $el.select('path'),
            opacity = $($pellet.node()).css('fill-opacity'),
            pathNode = $path.node(),
            highestPoint = parseFloat($path.attr('highestPoint')),
            p = pathNode.getPointAtLength(progress * pathNode.getTotalLength()),
            interpolate = d3.scale.linear().domain([-1, highestPoint / 2]).range([that.factor, that.factor/1000]),
            factor = interpolate(p.y);
            transform = [p.x, p.y];

            var newOpacity = (opacity - 0.004);
            $pellet.style('fill-opacity', newOpacity);
            that.transformPellet($pellet, transform);
      });
      progress += factor;
      if (progress >= 1) {
        this.stopListening(this.model, 'transform', movePellets);
        $pellets.remove();
      }
    };
    this.listenTo(this.model, 'transform', movePellets);
  },

  transformPellet: function ($el, transform) { $el.attr({'transform': 'translate(' + transform[0] + ',' + transform[1] + ')'}); },

  generatePelletPath: function (pellet, randomY) {
    var array = [],
        middleX1 = this.getRandomX(),
        topX = middleX1 * 1.33,
        middleX2 = topX * 1.33;
        bottomX = middleX2 * 1.33;
    array[0] = [pellet[0], pellet[1]];
    array[1] = [middleX1, randomY + 20];
    array[2] = [topX, randomY];
    array[3] = [middleX2, randomY + 20];
    array[4] = [bottomX, pellet[1]];
    return array;
  },

  getRandomX: function (factor) {
    var num = Math.floor(Math.random() * (this.SPLASH_DISTANCE + 1));
    num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
    return num;
  },

  getRandomY: function (velocity) {
    velocity = velocity / 100;
    var randomY = -(Math.floor(Math.random() * (this.SPLASH_HEIGHT + 1 * velocity)));
    return randomY/velocity;
  },

  getRandomRadius: function () {
    return Math.floor(Math.random() * (this.maxRadius - this.minRadius)) + this.minRadius;
  },

  teardown: function () {
    this.stopListening(this.model);
    this.remove();
  }
});
