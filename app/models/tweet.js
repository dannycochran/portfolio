Portfolio.Models.Tweet = Backbone.Model.extend({

  linkTypes: [{
      name: 'http://',
      link: '<a href="',
    },
    {
      name: '#',
      link: '<a href="https://twitter.com/search?q=%23'
    },
    {
      name: '@',
      link: '<a href="https://twitter.com/search?q=%40'
    }],

  initialize: function () {
    this.findLinks();
  },

  findLinks: function () {
    var text = this.get('text'), newText = text;
    _.each(this.linkTypes, function (type) {
      function findType(s) {
        var start = text.indexOf(type.name, s), link, safeLink;
        if (start > -1) {
          end = text.indexOf(' ', start + 1);
          if (end === -1) end = text.length;
          link = text.substring(start, end);

          if (type.name === '#' || type.name === '@') safeLink = link.replace(/\W/g, '');
          else safeLink = link;

          newText = newText.replace(link, type.link + safeLink + '">' + link + '</a>');
          if (text.indexOf(type.name, end) > -1) findType(end); // get multiple instances
        }
      }
      findType(0);
    });
    this.set('text', newText);
  }
});
