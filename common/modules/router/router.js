
Portfolio.Utilities.Router = module.exports = Backbone.Router.extend({
  routes: {'*notFound': 'notFound'},
  template: require('./_404.html'),

  promise: function () {
    return new Promise(function (resolve, reject) { // start listening after the current stack
      _.defer(function () { this.once('route', reject); }.bind(this));
    }.bind(this));
  },

  notFound: function () { $('body').html(this.template); }
});