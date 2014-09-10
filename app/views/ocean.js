// SPECIAL THANKS: Jason Davies (jasondavies.com/wave)

Portfolio.Views.Ocean = Backbone.View.extend({
  model: Portfolio.Models.Game,

  WAVE_BUFFER: 100,
  pathHeight: 0,

  initialize: function () {
    this.waveLine = d3.svg.line().interpolate('basis');
    this.listenTo(this.model, 'transform', this.naturalWaveMovement);
    this.listenTo(this.model, 'resize', this.onResize);
    this.listenTo(this.model, 'teardown', this.teardown);
  },

  activate: function ($ocean, dimensions) {
    this.$ocean = $ocean;
    this.oceanWidth = dimensions.width;
    this.oceanHeight = dimensions.height;
    this.startY = dimensions.startY;
    this.numWaves = dimensions.numWaves;

    this.$wave = this.$ocean.append('path').attr({'class': 'wave'});
    this.waves = [];
    this.waves.push([-this.WAVE_BUFFER, this.startY]);
    for (var i = 1; i < this.numWaves; i++) this.waves.push([this.oceanWidth / this.numWaves * i, this.startY]);
    this.waves.push([this.oceanWidth + this.WAVE_BUFFER, this.startY]);

    this.$background = this.$ocean.append('rect')
      .attr({x: 0, y: this.startY, height: '100%', width: '100%', class: 'background'});
  },

  naturalWaveMovement: function (obj) {
    this.pathHeight += (this.startY / 4 - this.pathHeight) / 10;
    for (var i = 1; i < this.numWaves; i++) {
      var sinSeed = (obj.elapsed / 10) + ((i * 10) + (i % 10)) * 100,
          sinHeight = Math.cos(sinSeed / 200) * this.pathHeight,
          newH = Math.cos(sinSeed / 200) * sinHeight + this.oceanHeight/3;
      this.waves[i][1] = newH;
    }
    this.$wave.attr('d', this.waveLine(this.waves));
  },

  onResize: function (newWidth) {
    if (!this.waves) return;
    this.oceanWidth = newWidth;
    for (var i = 1; i < this.numWaves; i++) this.waves[i][0] = newWidth / this.numWaves * i;
    this.waves[this.waves.length - 1][0] = this.oceanWidth + this.WAVE_BUFFER;
  },

  teardown: function () {
    this.stopListening(this.model);
    this.remove();
  }
});
