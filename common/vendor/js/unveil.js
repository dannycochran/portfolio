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
        $trg = $target || $w,
        th = threshold || 0,
        retina = window.devicePixelRatio > 1,
        attrib = retina? 'data-src-retina' : 'data-src',
        images = this,
        loaded,
        loading = '';

    function onUnveil() {
      var source = this.getAttribute(attrib);
      source = source || this.getAttribute('data-src');
      if (source) {
        this.setAttribute('src', source);
        if (typeof callback === 'function') callback.call(this);
      }
    }

    function unveil() {
      var inview = images.filter(function() {
        var $e = $(this);
        if ($e.css('display') === 'none') return;
        else {
          var et = $e.offset().top,
            eb = et + $e.height(),
            wt = $trg.scrollTop(),
            wb = wt + $trg.height();
          return eb >= wt - th && et <= wb + th;
        }
      });

      loaded = inview.trigger('unveil');
      images = images.not(loaded);
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
        $trg.on('scroll', unveil);
        $w.resize(unveil);
      },
      stop: function ($target) {
        images.off('unveil', onUnveil);
        $trg.off('scroll', unveil);
        $w.off('resize', unveil);
      }
    };
  };
})(window.jQuery || window.Zepto);
