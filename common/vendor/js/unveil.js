/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {
  $.fn.unveil = function(threshold, callback, $target) {
    var $w = $(window),
        $container = $target || $w,
        th = threshold || 0,
        retina = window.devicePixelRatio > 1,
        attrib = retina? 'data-src-retina' : 'data-src',
        images = this,
        loading = '';

    function onUnveil() {
      var source = this.getAttribute(attrib);
      source = source || this.getAttribute('data-src');
      if (source) {
        this.removeAttribute('data-src');
        this.setAttribute('src', source);
        if (typeof callback === 'function') callback.call(this);
      }
    }

    function unveil() {
      var inview = images.filter(function() {
        var $img = $(this);
        if ($img.css('display') === 'none') return;
        else {
          var imageTop = $img.offset().top,
              imageBottom = imageTop + $img.height(),
              containerTop = $container.offset().top,
              containerBottom = $container.height();
          return imageTop >= containerTop - th && imageBottom <= containerBottom + th;
        }
      });
      // load just one image at a time and then check for more after load is finished
      var $first = $(inview[0]);
      $first.trigger('unveil');
      $first.one('load', function () { unveil(); });
      images = images.not($first);
    }

    return {
      replaceDataSrc: function () {
        images.each(function () {
          var src = this.getAttribute('src');
          this.setAttribute('src', loading);
          this.setAttribute(attrib, src);
        });

        return this;
      },
      unveil: function () { unveil(); },
      start: function () {
        images.one('unveil', onUnveil);
        $container.on('scroll', unveil);
        $w.resize(unveil);
      },
      stop: function ($target) {
        images.off('unveil', onUnveil);
        $container.off('scroll', unveil);
        $w.off('resize', unveil);
      }
    };
  };
})(window.jQuery || window.Zepto);
