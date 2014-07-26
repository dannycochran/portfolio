Portfolio.Views.Splash = Backbone.View.extend({
  model: Portfolio.Models.Game,

  NUM_SPLASHES: 10,
  MAX_RADIUS: 10,
  MIN_RADIUS: 5,

  SPLASH_DISTANCE: 200,
  SPLASH_HEIGHT: 200,

  DURATION: 1000,


  initialize: function () {
    this.listenTo(this.model, 'transform', this.splashLocation);
  },

  activate: function ($splash, dimensions) {
    this.$splash = $splash;

    this.oceanWidth = dimensions.width;
    this.OCEAN_HEIGHT = dimensions.height;
    this.START_Y = dimensions.startY;
    this.NUM_WAVES = dimensions.numWaves;
    this.pathHeight = this.OCEAN_HEIGHT / 40;

    this.line = d3.svg.line().interpolate('basis');

    this.pellets = [];
    for (var i = 0; i < this.NUM_SPLASHES; i++) this.pellets.push([0, 0, this.getRandomRadius()]);

    _.each(this.pellets, function(pellet, i) {
      var group = this.$splash.append('g').classed('pelletGroup', true);

      group.attr({
        'transform': 'translate(' + this.oceanWidth / 2 + ' ' + this.START_Y + ')'
      });

      group.append('circle').attr({
        cx: this.pellets[i][0],
        cy: this.pellets[i][1],
        r: this.pellets[i][2],
        class: 'pellet'
      });

      group.append('path').attr({
        d: this.line(this.generatePelletPath(this.pellets[i]))
      });
    }, this);

    _.delay(function(v) {
      v.splash();
    }, this.DURATION, this);
  },

  splash: function () {
    // var that = this;
    // this.$pellets.each(function(pellet) {
    //   var $el = d3.select(this);
    //   $el.transition().duration(that.DURATION);
    // });
  },

  splashLocation: function (obj) {
  },

  generatePelletPath: function (pellet) {
    var array = [],
        topX = this.getRandomX(),
        bottomX = topX > 0 ? topX + 5 : topX-5;
    array[0] = [pellet[0], pellet[1]];
    array[1] = [topX, this.getRandomY(-1)];
    array[2] = [topX, this.getRandomY(-1)];
    array[3] = [bottomX, pellet[1]];
    return array;
  },

  getRandomX: function (factor) {
    var num = Math.floor(Math.random() * (this.SPLASH_DISTANCE + 1));
    num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
    return num;
  },

  getRandomY: function (dir) {
    return -(Math.floor(Math.random() * (this.SPLASH_HEIGHT + 1)));
  },

  getRandomRadius: function () {
    return Math.floor(Math.random() * (this.MAX_RADIUS - this.MIN_RADIUS + 1)) + this.MIN_RADIUS;
  }

});
