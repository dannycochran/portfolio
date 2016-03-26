// Extended vendor libraries
$ = require('../extensions/zepto.js');
CaughtPromise = require('../extensions/caughtPromise.js');

// Non-extended vendor libraries
Backbone = require('jashkenas/backbone@1.1.2');
Backbone.$ = $;
_ = require('jashkenas/underscore@1.8.3');
d3 = require('mbostock/d3@v3.4.13');

// forked vendor libraries
require('dannycochran/headroom.js@master');
require('dannycochran/unveil@1.4.0');

require('./hydrate.js');
Portfolio = {Models: {}, Views: {}, Collections: {}, Utilities: {}}; // Namespace for model/view classes

_.extend(Portfolio, {
  ANIMATION_DURATION: 400, // Length of animations
  UNDO_DURATION: 500, // Pause before undos are batched and models are saved
  READ_DURATION: 4000,

  EPSILON: 0.00000001,
  GOLDEN: 1.61803398875,

  RESOLVE: CaughtPromise.resolve(),
  REJECT: CaughtPromise.reject(),

  // Formatting
  formatNumber: _.wrap(d3.format('.3g'), function (format, number) {
    if (typeof number !== 'number') return;
    var rounded = d3.round(number, 8);
    if (number < 0.01 && number > -0.01 && number !== 0) return number.toExponential(2); else return format(number);
  }),
  formatCount: d3.format(',d'),
  formatDollar: d3.format('$,.2f'),
  formatPercentage: _.wrap(d3.format('.1%'), function (format, number) {
    if (typeof number !== 'number') return;
    var formatted = format(number);
    if (formatted === format(0) && number !== 0)
      return '~' + formatted;
    else return format(number);
  }),
  formatTime: d3.time.format('%x, %H:%M'),

  spinner: _.template(require('./_spinner.html')),
  timeFormat: _.wrap(d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ").parse, function (format, number) {
    var date = new Date(number);
    if (!date.getYear()) {
      var a = number.split(/[^0-9]/);
      date =new Date (a[0],a[1]-1,a[2],a[3],a[4],a[5] );
    }
    var today = new Date(),
        year = date.getYear() + 1900;
    if (+today - +date < this.week) return this.days[date.getDay()];
    else return this.days[date.getDay()] + ', ' + this.months[date.getMonth()] +
    ' ' + date.getDate() + ' ' + year;
  }),

  // Utilities
  isMobile: ($.os.phone || $.os.tablet) && !$.browser.ie,

  loadImageStyle: function () {
    var $el = $(this);
    $el.addClass('loading');
    $el.one('load', function () {
      _.delay(function () { $el.removeClass('loading'); }, Portfolio.ANIMATION_DURATION);
    });
  },
  week: 604800000,
  days: {
    '0': 'Sunday',
    '1': 'Monday',
    '2': 'Tuesday',
    '3': 'Wednesday',
    '4': 'Thursday',
    '5': 'Friday',
    '6': 'Saturday'
  },
  months: {'0': 'January', '1': 'February', '2': 'March', '3': 'April', '4': 'May',
  '5': 'June', '6':'July','7':'August','8':'September','9':'October','10':'November',
  '11':'December'},
  transitionend: 'transitionend',
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
