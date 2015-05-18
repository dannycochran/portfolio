require('../../vendor/js/zepto.js');

$.fn.scroll = function (properties, duration) {
  var animates = [], start = null;
  var easing = function (x) { return (-Math.cos(x * Math.PI) / 2) + 0.5; };

  var getAnimate = function (property, source, target) {
    var animate = function (timestamp) {
      if (start === null) start = timestamp;
      var progress = timestamp - start,
          shift = easing(Math.min(progress / duration, 1));

      this[property](source + (target - source) * shift);
      if (progress <= duration) requestAnimationFrame(animate);
    }.bind(this);
    return animate;
  }.bind(this);

  for (var property in properties) animates.push(getAnimate(property, this[property](), properties[property]));
  animates.every(requestAnimationFrame);

  return this;
};

$.fn.getScrollTarget = function (rel) {
  if (!this || !this.length) return;
  var target, parent = rel ? $(rel) : this.parent(),
      offset = this.offset(), parentOffset = parent.offset();

  if (offset.top < parentOffset.top || offset.top - parentOffset.top > parent.height())
    target = offset.top - parentOffset.top + parent.scrollTop();
  else if (offset.top - parentOffset.top + offset.height > parent.height() && offset.height < parent.height())
    target = offset.top - parentOffset.top + offset.height - parent.height() + parent.scrollTop();
  return target;
};

if (module && module.exports) module.exports = $;