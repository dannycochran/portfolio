(function setHydrate () {
  var hydration = {
    hydrate: function () { // returns the first successful sync or abort if router fires first
      if (!this.hydrated) { // check that the model has not called onHydrate
        var promise = this.isNew && this.isNew() ? this.save({hydrate: true}) : this.fetch({hydrate: true});
        this.hydrated = new CaughtPromise(promise).then(this.onHydrate.bind(this), this.onNoHydrate.bind(this));
      }
      return CaughtPromise.race([this.hydrated, Portfolio.app.router.promise()]); // race with the router changing views
    },
    onHydrate: function () {}, // noop
    onNoHydrate: function () {
      this.hydrated = false; // promise was rejected
      return Portfolio.REJECT;
    }
  };

  _.extend(Backbone.Model.prototype, hydration);
  _.extend(Backbone.Collection.prototype, hydration);
})();

Backbone.sync = _.wrap(Backbone.sync, function (sync, method, model, options) {
  var syncFunction = function () {
    if (options.hydrate && model.promise) return model.promise; // checking hydration and already hydrated

    var doSync;
    try { doSync = sync(method, model, options); } catch (e) { doSync = Portfolio.RESOLVE; } // no url

    if (!model.promise && method !== 'delete') { // first sync always hydrates
      model.promise = doSync.then(undefined, function () { // reject only
            model.promise = null;
            return Portfolio.REJECT;
          });
      return model.promise;
    } else return doSync;
  };

  return syncFunction().then(function () { });
});