Portfolio.Router = Backbone.Router.extend({

  routes: {
    '': 'routeGame',
    ':area': 'routeArea',
    'home/:post': 'routePost'
  },

  routeGame: function () { globals.app.render('home'); },

  routePost: function (postId) {
    this.routeArea('home');
    var CV = globals.app.home.currentView;
    this.listenTo(CV.model, 'change:scroller', function () {
      var post = CV.posts.model.get(postId);
      post.set('selectedPost', true);
    });
  },

  routeArea: function (param) {
    var CV = globals.app.home.currentView;
    if (CV && CV.name === 'home') {
      if (globals.app.navbar.$el.hasClass('single-post')) globals.app.model.trigger('show:posts', true);
      else if (CV.posts.selectedPost) CV.posts.selectedPost.set('selectedPost', true);
      else globals.app.render(param);
    }
    else globals.app.render(param);
  }
});