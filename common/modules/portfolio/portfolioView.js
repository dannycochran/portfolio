var Navbar = require('../navbar/navbar.js'),
    Slidebar = require('../slidebar/slidebar.js'),
    Model = require('./portfolioModel.js');

Portfolio.Views.Portfolio = module.exports = Backbone.View.extend({
  model: new Model(),

  className: 'portfolio',
  sections: {},
  currentView: null,
  template: require('./_portfolio.html'),

  events: {'mousewheel div.home > ul, div.home > ol': 'onScroll'},

  initialize: function() {
    this.navbar = new Navbar({model: this.model});
    this.slidebar = new Slidebar({model: this.model, sections: _.keys(this.sections)});
  },

  onResize: function () {
    if (this.currentView) this.currentView.onResize();
    this.slidebar.onResize();
  },

  onScroll: function (e) {
    if (e.currentTarget !== this.navbar.headroom.scroller) this.navbar.updateScroller(e.currentTarget);
  },

  mount: function () {
    $(window).resize(this.onResize.bind(this));

    this.$el.append(this.navbar.el);
    this.navbar.render();

    this.$el.append(this.slidebar.el);
    this.slidebar.render();

    this.$el.append(this.template);
    this.$container = this.$('div.content-container');

    return this;
  },

  render: function () {
    this.$el.find('div.spinner').remove();
    this.currentView.render();

    _.defer(function () { this.currentView.$el.removeClass('closed'); }.bind(this));
  },

  routeSection: function (section) {
    if (!this.sections[section]) section = 'home';
    return this.build(section);
  },

  routeSubSection: function (section, subSection) {
    if (!this.sections[section]) this.build('home');
    else this.currentView.renderSubSection(subSection);
  },

  build: function (section) {
    var previousView = this.currentView,
        currentView = this.sections[section];

    if (previousView === currentView) {
      currentView.render();
      return Portfolio.RESOLVE;
    } else {
      this.slidebar.changeSection(section);
      this.$el.append(Portfolio.spinner({message: 'Loading ' + section}));

      return currentView.build().then(function () {
        var doRender = function () {
          mixpanel.track('Viewing ' + section);
          if (this.$container.children().indexOf(currentView.el) < 0) this.$container.append(this.currentView.el);
          else currentView.$el.show();

          if (this.previousView) this.previousView.$el.hide();

          this.render();
        }.bind(this);

        this.currentView = currentView;
        this.previousView = previousView;
        if (previousView && previousView.cid !== currentView.cid)
          return CaughtPromise.resolve(previousView.teardown()).then(doRender); // cast teardown to promise
        else doRender();
      }.bind(this));
    }
  },

  teardown: function () {
    this.stopListening();
    $(window).off('resize', this.onResize);
  }
});