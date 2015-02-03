Portfolio.Models.Post = module.exports = Backbone.Model.extend({
  initialize: function () {
    var type = this.get('type'), body = '';
    if (!this.get('title')) this.set('title', type);

    if (type === 'photo') {
      _.each(this.get('photos'), function (photo) {
        var img = '<img src="' + photo['original_size'].url + '" />', caption = '';
        if (photo.caption.length) caption = '<p>' + photo.caption + '</p>';
        body += img + caption;
      }.bind(this));

      var caption = this.get('caption').replace(/(\r\n|\n|\r)/gm,""), // remove all line breaks
          locator = '<blockquote><p>',
          start = caption.indexOf(locator) + locator.length;
      if (start <= 14) start = caption.indexOf('target') + locator.length;

      var photoTitle = caption.substring(start, caption.indexOf('</', start));
      this.set('title', photoTitle);

      body += caption;
      this.set('body', body);
    }
  }
});