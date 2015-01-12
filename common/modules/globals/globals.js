// Ayasdi Inc. Copyright 2014 - all rights reserved.

require('ayasdi/base');
Portfolio = Ayasdi;
require('./hydrate.js');

Portfolio = _.extend(Portfolio, {
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
