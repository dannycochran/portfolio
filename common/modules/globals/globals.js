import spinner from './_spinner.html';

window.$ = window.jQuery = require('jquery');
window.Backbone = require('backbone');
window._ = window.underscore = require('underscore');

// forked vendor libraries
require('headroom.js');
require('unveil/unveil.js');

require('./hydrate.js');
window.Portfolio = {Models: {}, Views: {}, Collections: {}, Utilities: {}}; // Namespace for model/view classes

_.extend(Portfolio, {
  ANIMATION_DURATION: 400, // Length of animations

  spinner: _.template(spinner),

  loadImageStyle: function () {
    var $el = $(this);
    $el.addClass('loading');
    $el.one('load', function () {
      _.delay(function () { $el.removeClass('loading'); }, Portfolio.ANIMATION_DURATION);
    });
  },

  getUniqueId: function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return function() {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    };
  }
});
