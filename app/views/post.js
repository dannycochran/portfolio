Portfolio.Views.Post = Backbone.View.extend({
  tagName: 'li',
  className: 'post',
  name: 'post',

  template: _.template($('#post-template').html()),

  events: {
    'click div.post-title': 'onPostSelect'
  },

  initialize: function () {
    this.listenTo(this.model, 'change:postHidden', this.onPostHide);
  },

  render: function () {
    this.$el.html(this.template({post: this.model}));
    this.$el.attr('id', 'post' + this.model.get('id'));
    return this;
  },

  onPostSelect: function () { this.model.set('selectedPost', true); },

  onPostHide: function () {
    if (this.model.get('postHidden')) this.$el.hide();
    else this.$el.show();
  },
});