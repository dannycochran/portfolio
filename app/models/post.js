Portfolio.Models.Post = Backbone.Model.extend({
  initialize: function () {
    var type = this.get('type'), body = '';
    if (!this.get('title')) this.set('title', type);

    if (type === 'photo') {
      _.each(this.get('photos'), function (photo) {
        var img = '<img src="' + photo['original_size'].url + '" />', caption = '';
        if (photo.caption.length) caption = '<p>' + photo.caption + '</p>';
        body += img + caption;
      }.bind(this));

      body += this.get('caption');
      this.set('body', body);
    }
  }
});