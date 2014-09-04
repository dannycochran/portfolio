Portfolio.Views.Game = Backbone.View.extend({
  model: Portfolio.Models.Game,
  className: 'game-container',
  template: _.template($('#game-template').html()),

  DURATION: 20000,
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

    this.boundOnResize = _.debounce(this.onResize, globals.duration);
    $(window).on('keydown', this.onKeyDown.bind(this));
    $(window).on('resize', this.boundOnResize.bind(this));
  },

  render: function() {
    this.$el.html(this.template());
    this.$game = d3.select(this.el).append('svg').attr({'width': '100%', 'height': '100%'})
      .on('mousemove', this.mouseMove.bind(this))
      .on('touchmove', this.touchMove.bind(this));

    this.$defs = this.$game.append('defs');
    this.$gradient = this.$defs.append('linearGradient').attr({id: 'gradient', y1: '0%', y2: '100%', x1: '0%', x2: '0%'});
    this.$stopBegin = this.$gradient.append('stop').attr({offset: '30%', 'stop-color': 'rgb(56, 194, 240)'});
    this.$stopEnd = this.$gradient.append('stop').attr({offset: '90%', 'stop-color': 'rgb(0, 0, 255)'});

    this.harpoonersView.render();
    this.whaleView.render();

    _.delay(function () { this.createGame(); }.bind(this), 1);
    return this;
  },

  createGame: function() {
    this.lastElapsed = 0;
    this.oceanWidth = this.$el.width();
    this.oceanHeight = this.$el.height() * (2/3);
    this.startY = this.$el.height() * (1/3);
    this.mouse = [this.oceanWidth / 3, this.startY * 2];

    this.animInterpolator = d3.scale.linear().domain([0, this.DURATION]).range([1,0]);
    var dimensions = {
      width: this.oceanWidth,
      height: this.oceanHeight,
      startY: this.startY,
      duration: this.DURATION,
      numWaves: this.NUM_WAVES
    };

    // Add ocean
    this.$ocean = this.$game.append('g').classed('ocean-container', true);
    this.oceanView.activate(this.$ocean, dimensions);

    // Add splash
    this.$splashes = this.$ocean.append('g').classed('splashes', true);
    this.splashView.activate(this.$splashes, dimensions);

    // Add harpooners
    this.$harpooners = this.$game.insert('g', ':first-child').attr('class', 'harpooners');
    this.harpoonersView.activate(this.$harpooners, dimensions);

    // Add whale
    this.$whale = this.$game.append('g').attr({class: 'whale'});
    this.whaleView.activate(this.$whale, dimensions);

    this.startMovement();
  },

  startMovement: function () {
    d3.timer(function (elapsed) {
      if (this.togglePlayOrPause) { this.lastElapsed = elapsed; return true; }

      elapsed = elapsed + this.lastElapsed;

      // Update domain once harpooners finishes going from one end to the other
      var domain = this.animInterpolator.domain(), props = {};
      props.duration = 100;
      if (elapsed >= domain[1]) {
        this.animInterpolator.domain([domain[0] + this.DURATION, domain[1] + this.DURATION]);
        props.duration = 0;
      }

      props.interpolated = this.animInterpolator(elapsed);
      props.elapsed = elapsed;
      props.mouse = this.mouse;
      props.wave = this.oceanView.$wave;

      this.model.trigger('transform', props);
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
    this.model.trigger('teardown');
    this.teardown();

    this.trigger('navigate', 'home');
    return false;
  },

  toggleGame: function () {
    this.togglePlayOrPause = this.togglePlayOrPause ? false: true;
    if (!this.togglePlayOrPause) this.startMovement();

    var button = this.$el.find('header > i'),
        togglePlayOrPause = button.hasClass('fa-pause');
    if (togglePlayOrPause) button.removeClass('fa-pause').addClass('fa-play');
    else button.addClass('fa-pause').removeClass('fa-play');
  },

  onKeyDown: function (e) {
    if (e.keyCode === 32) {
      e.preventDefault();
      this.toggleGame();
    }
  },

  onResize: function () { this.model.trigger('resize', this.$el.width()); },

  teardown: function () {
    this.remove();
    $(window).off('resize', this.boundOnResize);
    $(window).off('keydown', this.onKeyDown);
  }
});