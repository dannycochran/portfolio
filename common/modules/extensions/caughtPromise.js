var Promise = require('../../vendor/js/promise.js').Promise;
var _ = require('jashkenas/underscore@1.8.3');

function CaughtPromise (promise) {
  if (promise instanceof Promise) this.promise = promise;
  else if (typeof promise === 'function') this.promise = new Promise(promise);
  else this.promise = Promise.resolve(promise);
}

CaughtPromise.resolve = function (val) {
  return new CaughtPromise(Promise.resolve(val));
};
CaughtPromise.reject = function (val) { return new CaughtPromise(Promise.reject(val)); };
CaughtPromise.all = function (promises) { return new CaughtPromise(Promise.all(promises)); };
CaughtPromise.race = function (promises) { return new CaughtPromise(Promise.race(promises)); };
CaughtPromise.prototype.then = function (resolve, reject) {
  var report = function (err) {
            if (err instanceof Error) console.error('Promise caught ' + err + '\n\t' + err.stack);
            return CaughtPromise.reject();
          },
      doCatch = function () { // GOTTA CATCH EM ALL!
            var args = _.toArray(arguments),
                fn = args.shift(), state = report(args[0]);
            if (typeof fn === 'function') state = fn.apply(this, args);
            return state;
          },
      captured = _.wrap(reject, doCatch);
  return new CaughtPromise(this.promise.then(resolve, captured).catch(report));
};
CaughtPromise.prototype.catch = function (reject) { return this.then(undefined, reject); };

// export CaughtPromise
if (module && module.exports) module.exports = CaughtPromise;
