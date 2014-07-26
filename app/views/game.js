Portfolio.Views.Game = Backbone.View.extend({
  model: Portfolio.Models.Game,
  className: 'game-container',
  template: _.template($('#game-template').html()),

  DURATION: 20000,
  SKY_HEIGHT: 140,
  OCEAN_HEIGHT: 400,

  NUM_WAVES: 5,

  events: {
    'click header > a': 'skipGame',
    'click header > i': 'toggleGame'
  },

  initialize: function() {
    this.listenTo(this.model, 'toggle:game', this.toggleGame);

    this.oceanView = new Portfolio.Views.Ocean({model: this.model});
    this.harpoonersView = new Portfolio.Views.Harpooners({model: this.model});
    this.splashView = new Portfolio.Views.Splash({model: this.model});
    this.whaleView = new Portfolio.Views.Whale({model: this.model});
  },

  render: function() {
    this.$el.html(this.template());
    this.$game = d3.select(this.el).append('svg').attr({'width': '100%', 'height': '100%'})
      .on('mousemove', this.mouseMove.bind(this))
      .on('touchmove', this.touchMove.bind(this));

    this.harpoonersView.render();
    this.whaleView.render();

    _.delay(function () { this.createGame(); }.bind(this), 1);
    return this;
  },

  createGame: function() {
    this.lastElapsed = 0;
    this.START_Y = this.OCEAN_HEIGHT / 2;
    this.oceanWidth = this.$el.width();
    this.mouse = [this.oceanWidth / 3, this.START_Y * 2];

    this.animInterpolator = d3.scale.linear().domain([0, this.DURATION]).range([1,0]);
    var dimensions = {width: this.oceanWidth, height: this.OCEAN_HEIGHT, startY: this.START_Y,
          duration: this.DURATION, numWaves: this.NUM_WAVES};

    // Add ocean
    this.$ocean = this.$game.append('g').classed('ocean-container', true);
    this.oceanView.activate(this.$ocean, dimensions);

    // Add harpooners
    this.$harpooners = this.$game.insert('g', ':first-child').attr('class', 'harpooners');
    this.harpoonersView.activate(this.$harpooners, dimensions);

    // Add whale
    this.$whale = this.$game.append('g').attr({class: 'whale'});
    this.whaleView.activate(this.$whale, dimensions);

    // Add splash
    // this.$splash = this.$game.append('g').classed('splash', true);
    // this.splashView.activate(this.$splash, dimensions);

    this.startMovement();
  },

  startMovement: function () {
    d3.timer(function (elapsed) {
      if (this.togglePlayOrPause) { this.lastElapsed = elapsed; return true; }

      elapsed = elapsed + this.lastElapsed;

      // Update domain once harpooners finishes going from one end to the other
      var domain = this.animInterpolator.domain();
      if (elapsed >= domain[1]) this.animInterpolator.domain([domain[0] + this.DURATION, domain[1] + this.DURATION]);

      this.model.trigger('transform', {
        interpolated: this.animInterpolator(elapsed),
        elapsed: elapsed,
        mouse: this.mouse,
        wave: this.oceanView.$wave
      });
    }.bind(this));
  },

  mouseMove: function () {
    this.mouse = d3.mouse(this.$game.node());
  },

  touchMove: function () {
    var touches = d3.touches(this.$game.node());
    if (touches.length === 0) return;
    else this.mouse = touches[0];
  },

  skipGame: function () {
    this.trigger('navigate', 'home');
    return false;
  },

  toggleGame: function () {
    var splashLeft = this.$el.find('.splash-left'),
        splashRight = this.$el.find('.splash-right');

    splashLeft.children().toggleClass('splashing-left');
    splashRight.children().toggleClass('splashing-right');

    this.togglePlayOrPause = this.togglePlayOrPause ? false: true;
    if (!this.togglePlayOrPause) this.startMovement();

    var button = this.$el.find('header > i'),
        togglePlayOrPause = button.hasClass('fa-pause');
    if (togglePlayOrPause) button.removeClass('fa-pause').addClass('fa-play');
    else button.addClass('fa-pause').removeClass('fa-play');
  }

});