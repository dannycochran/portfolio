var AppView = require('../../../common/modules/app/appView.js'),
    MobyDick = require('dannycochran/mobydick');

var Home = require('../../../common/modules/home/home.js'),
    Projects = require('../../../common/modules/projects/projectsView.js'),
    Resume = require('../../../common/modules/resume/resumeView.js');
    About = require('../../../common/modules/about/aboutView.js');

DC.Views.App = module.exports = AppView.extend({
  game: new MobyDick(),

  sections: {
    home: new Home(),
    projects: new Projects(),
    resume: new Resume(),
    about: new About()
  },

  initialize: function() {
    AppView.prototype.initialize.apply(this, arguments);
    this.listenTo(this.sections.home, 'interaction:selectedPost', this.onInteractionSelectedPost.bind(this));
  },

  createRoutes: function () {
    AppView.prototype.createRoutes.apply(this, arguments);
    this.router.route('game', 'game', this.routeGame.bind(this));
    this.router.route('home/:postId("/")', 'postId', this.routePostId.bind(this));
  },

  routeGame: function () {
    this.$el.empty();
    this.game.teardown().build().render().start();
    this.mounted = false;
  },

  routePostId: function (paramPostId) {
    var postsModel = this.sections.home.posts.model;
    this.$el.append(Portfolio.spinner({message: 'Loading post'}));

    postsModel.hydrate().then(function () {
      if (!postsModel.get(paramPostId)) {
        this.build(this.sections.home);
        this.router.navigate(this.sections.home.name, {trigger: false, replace: true});
      } else this.build(this.sections.home, paramPostId);
    }.bind(this));
  },

  onInteractionSelectedPost: function () {
    this.navbar.$el.addClass('headroom-pinned').removeClass('closed');
    this.$portfolio.toggleClass('single-post', this.sections.home.selectedPost() !== null);
  }
});