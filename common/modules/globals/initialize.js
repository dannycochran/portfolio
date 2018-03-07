require('./globals.js');

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

function mixPanelUser () {
  var randomUserId = null;
  if (!localStorage.getItem('randomUserId')) {
    randomUserId = Portfolio.getUniqueId();
    localStorage.setItem('randomUserId', randomUserId);
  } else randomUserId = localStorage.getItem('randomUserId');

  if (randomUserId === null) mixpanel.identify();
  else mixpanel.identify(randomUserId);
}

function initialize (view, namespace) {
  if (typeof(mixpanel) === 'undefined') {
    window.mixpanel = {
      track: function (action, metadata, callback) { if (callback) callback(); },
      identify: function () {}
    };
  }

  $(document).ready(function () {
    mixPanelUser();

    setupNames(Portfolio);
    setupNames(namespace);

    Portfolio.app = new view();
    if (!Backbone.history.start({pushState: true})) Portfolio.app.router.notFound();
  });
}

// export initialize fn
if (module && module.exports) module.exports = initialize;
