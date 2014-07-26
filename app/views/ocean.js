// SPECIAL THANKS: Jason Davies (jasondavies.com/wave)

Portfolio.Views.Ocean = Backbone.View.extend({
  model: Portfolio.Models.Game,

  WAVE_BUFFER: 100,

  initialize: function () {
    this.waveLine = d3.svg.line().interpolate('basis');
    this.listenTo(this.model, 'transform', this.naturalWaveMovement);
  },

  activate: function ($ocean, dimensions) {
    this.$ocean = $ocean;
    this.oceanWidth = dimensions.width;
    this.OCEAN_HEIGHT = dimensions.height;
    this.START_Y = dimensions.startY;
    this.NUM_WAVES = dimensions.numWaves;
    this.pathHeight = this.OCEAN_HEIGHT / 40;

    this.$wave = this.$ocean.append('path').attr({'class': 'wave'});
    this.waves = [];
    this.waves.push([-this.WAVE_BUFFER, this.START_Y]);
    for (var i = 1; i < this.NUM_WAVES; i++) this.waves.push([this.oceanWidth / this.NUM_WAVES * i, this.START_Y]);
    this.waves.push([this.oceanWidth + this.WAVE_BUFFER, this.START_Y]);

    this.$background = this.$ocean.append('rect')
      .attr({x: 0, y: this.START_Y, height: this.OCEAN_HEIGHT, width: this.oceanWidth, class: 'background'});
  },

  naturalWaveMovement: function (obj) {
    this.pathHeight += (this.START_Y / 4 - this.pathHeight) / 10;
    for (var i = 1; i < this.NUM_WAVES; i++) {
      var sinSeed = (obj.elapsed / 10) + ((i * 10) + (i % 10)) * 100,
          sinHeight = Math.cos(sinSeed / 200) * this.pathHeight,
          newH = Math.cos(sinSeed / 200) * sinHeight + this.OCEAN_HEIGHT/3;
      this.waves[i][1] = newH;
    }
    this.$wave.attr('d', this.waveLine(this.waves));
  }

});
