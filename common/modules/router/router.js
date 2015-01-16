
Portfolio.Utilities.Router = module.exports = Backbone.Router.extend({
  routes: {'*all': 'routeAll'},

  initialize: function (app) { this.app = app; },

  promise: function () {
    return new Promise(function (resolve, reject) { // start listening after the current stack
      _.defer(function () { this.once('route', reject); }.bind(this));
    }.bind(this));
  },

  notFound: function () { window.location.replace('/'); },

  routeAll: function () { this.app.onRoute(arguments); }
});