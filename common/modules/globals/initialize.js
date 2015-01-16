require('./globals.js');

var onReady = function () {
  // check browser
  var safari = !!$.browser.safari, ie = !!$.browser.ie, chrome = !!$.browser.chrome,
      version = Infinity,
      complain = function (browser, oldVersion, requiredVersion) {
        alert('We currently do not offer support for ' +
            browser + ' ' + oldVersion + '. Please update to (at least) version ' + requiredVersion + '.');
        throw {name: 'NotSupported', message: 'This browser is not supported.'};
      };

  if ($.browser.version.split('.').length - 1 > 1) {
    version = $.browser.version.split('.');
    version = parseFloat(version[0] + '.' + version[1] + version[2]);
  } else version = parseFloat($.browser.version);

  if (safari && version < 6.1) complain('Safari', version, '6.1');
  else if (ie && version < 10) complain('Internet Explorer', version, '10.0');
  else if (chrome && version < 26) Portfolio.transitionend = 'webkitTransitionEnd';
};

function setupNames (namespace) {
  if (!namespace) return;
  
  var nameGroups = ['Views', 'Models', 'Collections'];
  function api (s) {
    var name = '';
    _.each(s, function (c, i) {
      if (c === c.toUpperCase()) {
        c = c.toLowerCase();
        if (i !== 0) name += '_';
      }
      name += c;
    });
    return name;
  }

  function lower (s) { return s.charAt(0).toLowerCase() + s.slice(1); }

  _.each(nameGroups, function (group) {
    var c = namespace[group];
    if (c !== undefined) {
      _.keys(c).forEach(function (k) {
        c[k].prototype.name = lower(k);
        c[k].prototype.apiName = api(k);
      });
    }
  });
}

function initialize (view, namespace) {
  if (typeof(mixpanel) === 'undefined') {
    mixpanel = {
      track: function (action, metadata, callback) { if (callback) callback(); },
      identify: function () {}
    };
  }

  $(document).ready(function () {
    onReady();
    
    setupNames(Portfolio);
    setupNames(namespace);

    Portfolio.app = new view();
    if (!Backbone.history.start({pushState: true})) Portfolio.app.router.notFound();
  });
}

// export initialize fn
if (module && module.exports) module.exports = initialize;
