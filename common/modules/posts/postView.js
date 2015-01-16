Portfolio.Views.Post = module.exports = Backbone.View.extend({
  tagName: 'li',
  className: 'post',

  template: _.template(require('./_post.html')),

  render: function () {
    this.$el.data('id', this.model.get('id'));
    this.$el.html(this.template({post: this.model}));

    return this;
  }
});