var AppView = require('../../../common/modules/app/appView.js'),
    PortfolioView = require('../portfolio/portfolioView.js'),
    MobyDick = require('dannycochran/mobydick');

DC.Views.App = module.exports = AppView.extend({
  game: new MobyDick(),
  portfolio: new PortfolioView(),

  createRoutes: function () {
    AppView.prototype.createRoutes.apply(this, arguments);
    this.router.route('game', 'game', this.routeGame.bind(this));
  },

  routeGame: function () {
    this.$el.empty();
    this.portfolio.mounted = false;
    this.game.teardown().build().render().start();
  }
});