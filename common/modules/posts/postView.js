import postHtml from './_post.html';

Portfolio.Views.Post = module.exports = Backbone.View.extend({
  tagName: 'li',
  className: 'post',

  template: _.template(postHtml),

  render: function () {
    if (this.model.get('id')) {
      this.$el.data('id', this.model.get('id'));
      this.$el.html(this.template({post: this.model}));
    }

    return this;
  }
});