(function setHydrate () {
  var hydration = {
    hydrate: function () { // returns the first successful sync or abort if router fires first
      if (!this.hydrated) {// check that the model has not called onHydrate
        var promise = this.isNew && this.isNew() ? this.save({hydrate: true}) : this.fetch({hydrate: true});
        this.hydrated = new CaughtPromise(promise).then(this.onHydrate.bind(this), this.onNoHydrate.bind(this));
      }
      return CaughtPromise.race([this.hydrated, Ayasdi.router.promise()]); // race with the router changing views
    },
    onHydrate: function () {}, // noop
    onNoHydrate: function () {
      this.hydrated = false; // promise was rejected
      return Ayasdi.REJECT;
    }
  };

  _.extend(Backbone.Model.prototype, hydration);
  _.extend(Backbone.Collection.prototype, hydration);
})();