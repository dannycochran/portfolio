Portfolio.Views.Resume = Backbone.View.extend({
  className: 'resume closed',
  name: 'resume',

  template: _.template($('#resume-template').html()),

  events: {
    'click div.section > header': 'toggleSection',
    'click span.easter': 'easterTime'
  },

  render: function () {
    if (this.$sections) return;

    this.$el.html(this.template({'resume': this.model.attributes}));
    this.$sections = this.$el.find('div.section');

    this.$easter = this.$el.find('span[data-id="easter eggs"]');
    this.$easter.addClass('easter');

    this.model.set('scroller', this.el);

    return this;
  },

  toggleSection: function (e) {
    mixpanel.track('toggle resume section header');
    var $header = $(e.currentTarget), $section = $header.parent();

    $section.toggleClass('closed');
    $header.find('i').toggleClass('rotated');

    _.defer(function () {
      var total = this.$el.find('div.section').length, closed = this.$el.find('div.section.closed').length;
      if (total === closed) this.$el.addClass('centered');
      else this.$el.removeClass('centered');
    }.bind(this));
  },

  easterTime: function () {
    console.log('EASTER TIME!!!');
  },

  build: function (callback) {
    if (this.model.isHydrated()) callback();
    else {
      this.listenToOnce(this.model, 'hydrate', callback);
      this.model.hydrate();
    }
  },

  teardown: function (callback) {
    callback();
  }
});