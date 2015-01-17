
Portfolio.Utilities.Router = module.exports = Backbone.Router.extend({
  routes: {'*notFound': 'notFound'},

  initialize: function (notFoundCallback) { this.notFoundCallback = notFoundCallback; },

  promise: function () {
    return new Promise(function (resolve, reject) { // start listening after the current stack
      _.defer(function () { this.once('route', reject); }.bind(this));
    }.bind(this));
  },

  notFound: function () { this.notFoundCallback(); }
});