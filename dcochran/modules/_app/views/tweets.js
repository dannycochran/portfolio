Portfolio.Views.Tweets = Backbone.View.extend({
  tagName: 'ol',
  className: 'small-posts',
  name: 'tweets',

  template: _.template($('#tweets-template').html()),

  render: function () {
    this.$el.html(this.template({tweets: this.model.models}));
    return this;
  },
});