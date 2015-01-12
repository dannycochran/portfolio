Portfolio.Models.Posts = module.exports = Backbone.Collection.extend({
  url: '/louie/posts',
  model: require('./postModel.js')
});