
Portfolio.Utilities.Router = module.exports = Backbone.Router.extend({
  routes: {'*all': 'routeAll'},

  initialize: function (app) { this.app = app; },

  promise: function () {
    return new Promise(function (resolve, reject) { // start listening after the current stack
      _.defer(function () { this.once('route', reject); }.bind(this));
    }.bind(this));
  },

  notFound: function () { window.location.replace('/'); },

  routeAll: function () { this.app.onRoute(arguments); }
});

  // routes: {
  //   '': 'routeApp',
  //   ':area(/)': 'routeApp',
  //   'home/:post(/)': 'routeApp'
  // },

//     routePost: function (postId) {
//     // this.routeArea('home');
//     // var CV = this.app.home.currentView;
//     // this.listenTo(CV.model, 'change:scroller', function () {
//     //   var post = CV.posts.model.get(postId);
//     //   post.set('selectedPost', true);
//     // });
//   },

//   routeArea: function (param) {
//     // var CV = this.app.home.currentView;
//     // if (CV && CV.name === 'home') {
//     //   if (this.app.navbar.$el.hasClass('single-post')) this.app.model.trigger('show:posts', true);
//     //   else if (CV.posts.selectedPost) CV.posts.selectedPost.set('selectedPost', true);
//     //   else this.app.render(param);
//     // }
//     // else this.app.render(param);
//   }
// });