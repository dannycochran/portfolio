Portfolio.Models.Microposts = module.exports = Backbone.Collection.extend({
  url: '/louie/microposts',
  model: require('./micropostModel'),

  linkTypes: {
    urls: {
      start: '<a href="',
      content: 'url',
      end: '</a>'
    },
    hashtags: {
      start: '<a href="https://twitter.com/hashtag/',
      content: 'text',
      end: '</a>'
    },
    user_mentions: {
      start: '<a href="https://twitter.com/',
      content: 'screen_name',
      end: '</a>'
    },
    media: {
      start: '<img src="',
      content: 'media_url',
      replace: 'url',
      end: '/>'
    }
  },

  findLinks: function (model) {
    var text = model.get('text'),
        linkedText = text,
        entities = model.get('entities'),
        linkTypes = this.linkTypes;

    _.each(_.keys(entities), function (type) {
      if (entities[type].length) {
        _.each(entities[type], function (entity) {
          var content, link;
          if (type === 'media') {
            content = entity[linkTypes[type].replace];
            link = linkTypes[type].start + entity[linkTypes[type].content] + '"/>';
            if (entity.indices[1] === 140) {
              content = text.substring(text.indexOf('http'), 140);
            }
          } else {
            content = entity[linkTypes[type].content];
            link = linkTypes[type].start + content + '">' + content + linkTypes[type].end;
          }
          linkedText = linkedText.replace(content, link);
        });
      }
    });

    model.set('linkedText', linkedText);
  }
});