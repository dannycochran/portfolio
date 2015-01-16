var Router = require('../router/router.js'),
    PortfolioView = require('../portfolio/portfolioView.js');

Portfolio.Views.App = module.exports = Backbone.View.extend({
  el: 'body',
  events: {'click a[href]': 'onNavigate'},
  portfolio: new PortfolioView(),

  initialize: function() {
    this.router = new Router(this);
    this.createRoutes();

    var randomUserId = null;
    if (!localStorage.getItem('randomUserId')) {
      randomUserId = Portfolio.getUniqueId();
      localStorage.setItem('randomUserId', randomUserId);
    } else randomUserId = localStorage.getItem('randomUserId');

    if (randomUserId === null) mixpanel.identify();
    else mixpanel.identify(randomUserId);
  },

  createRoutes: function () {
    this.router.route(':portfolio("/")', 'portfolio', this.routePortfolio.bind(this));
    this.router.route(':portfolio/:subsection("/")', 'subSection', this.routePortfolioSubSection.bind(this));
  },

  routePortfolio: function (section) {
    if (!this.portfolio.mounted) {
      this.$el.empty();
      this.$el.append(this.portfolio.el);
      this.portfolio.mount().mounted = true;
    }

    return this.portfolio.routeSection(section);
  },

  routePortfolioSubSection: function (section, subSection) {
    if (!this.portfolio.mounted) {
      this.routePortfolio(section).then(function () {
        this.portfolio.routeSubSection(section, subSection);
      }.bind(this));
    } else this.portfolio.routeSubSection(section, subSection);
  },

  onRoute: function () {
    // uncaught routes go here
    this.routePortfolio();
  },

  onNavigate: function (e) {
    var href = $(e.currentTarget).attr('href');
    if (href.indexOf('.') < 0 || href.indexOf('http') < 0) { // internal links
      this.router.navigate(href, {trigger: true});
      return false;
    }
  }
});