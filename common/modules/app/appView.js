var Router = require('../router/router.js'),
    Navbar = require('../navbar/navbar.js'),
    Slidebar = require('../slidebar/slidebar.js'),
    Model = require('./appModel.js');

Portfolio.Views.App = module.exports = Backbone.View.extend({
  model: new Model(),
  template: require('./_app.html'),

  sections: {},
  defaultSection: 'home',
  currentView: null,

  el: 'body',
  events: {
    'click a[href]': 'onNavigate',
    'mousewheel div.content-container > ol, div.content-container > div > ol': 'onScroll'
  },

  initialize: function() {
    this.router = new Router(this.routeSection.bind(this));
    this.navbar = new Navbar({model: this.model});
    this.slidebar = new Slidebar({sections: _.keys(this.sections)});

    this.createRoutes();
    this.mount().mounted = true;
  },

  createRoutes: function () {
    this.router.route('', 'defaultSection', this.routeSection.bind(this));
    this.router.route(':portfolio("/")', 'section', this.routeSection.bind(this));
  },

  routeSection: function (paramSection) {
    var section = this.sections[paramSection] ? this.sections[paramSection] : this.sections[this.defaultSection];
    this.router.navigate(section.name, {trigger: false, replace: true});
    this.build(section);
  },

  onResize: function () {
    if (this.currentView && this.currentView.onResize) this.currentView.onResize();
    this.slidebar.onResize();
  },

  onScroll: function (e) {
    var blocked = e.currentTarget.getAttribute('data-scroller') === '-1';
    if (!blocked && e.currentTarget !== this.navbar.headroom.scroller) this.navbar.updateScroller(e.currentTarget);
  },

  onNavigate: function (e) {
    var href = $(e.currentTarget).attr('href');
    if (href.indexOf('.') < 0 || href.indexOf('http') < 0) { // external links
      this.router.navigate(href, {trigger: true});
      return false;
    } else mixpanel.track('Navigating to ' + href);
  },

  build: function (view, data) {
    this.slidebar.render(view.name);
    this.previousView = this.currentView;
    this.currentView = view;

    var doBuild = function () { this.currentView.build(data).then(this.onBuildSuccess.bind(this)); }.bind(this);

    if (this.previousView && this.currentView !== this.previousView) {
      if (!this.currentView.rendered) this.$el.append(Portfolio.spinner({message: 'Loading ' + view.name}));
      return CaughtPromise.resolve(this.teardownView(this.previousView, this.slidebar.direction)).then(doBuild);
    } else doBuild();
  },

  onBuildSuccess: function () {
    mixpanel.track('Viewing ' + this.currentView.name); // assuming mixpanel
    _.defer(this.render.bind(this));
  },

  teardownView: function (view, position) {
    return new CaughtPromise(function (resolve, reject) {
      if (view.teardown) view.teardown();
      view.$el.data('position', position);
      _.delay(resolve, Portfolio.ANIMATION_DURATION);
    }.bind(this));
  },

  render: function () {
    this.currentView.$el.data('position', this.slidebar.opposite);

    this.$container.html(this.currentView.el);
    this.currentView.render().rendered = true;

    _.delay(function () {
      this.$el.find('div.spinner').remove();
      this.currentView.$el.data('position', null);
    }.bind(this), Portfolio.ANIMATION_DURATION/10);

    return this;
  },

  mount: function () {
    $(window).resize(this.onResize.bind(this));

    this.$el.html(this.template);
    this.$el.append(Portfolio.spinner({message: 'Loading'}));

    this.$portfolio = this.$('div.portfolio');
    this.$container = this.$('div.content-container');

    this.$portfolio.prepend(this.navbar.el);
    this.navbar.render();

    this.$portfolio.prepend(this.slidebar.el);
    this.slidebar.render();

    return this;
  }
});