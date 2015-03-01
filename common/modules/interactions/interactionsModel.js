Portfolio.Utilities.Interactions = module.exports = Backbone.Model.extend({
  add: function (object, name, options) {
    options = options || {};

    // Generate a dummy cid if necessary (e.g., collections)
    if (!object.cid) object.cid = _.uniqueId('dummy');
    var key = object.name + '-' + object.cid + '-' + name,
        previousValue = options.initialValue;

    object[name] = function (value, interactionOptions) {
      var currentValue = this.get(key);
      if (value !== undefined) {
        if (currentValue !== value) previousValue = currentValue;
        this.set(key, value, interactionOptions);
      } else return currentValue;
    }.bind(this);

    object[name].previous = function () { return previousValue; };

    if (options.initialValue !== undefined) this.set(key, options.initialValue);

    // When the interaction model changes, trigger the corresponding event on the registered object after allowing the
    // object to optionally handle the change with a callback
    this.on('change:' + key, function () {
      var trigger = function () { object.trigger('interaction:' + name, object); };
      if (options.callback) CaughtPromise.resolve(options.callback(object)).then(trigger);
      else trigger();
    });
  }
});
