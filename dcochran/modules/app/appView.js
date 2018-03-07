var AppView = require('../../../common/modules/app/appView.js');

var Blog = require('../../../common/modules/blog/blog.js'),
    Projects = require('../../../common/modules/projects/projectsView.js'),
    Resume = require('../../../common/modules/resume/resumeView.js'),
    About = require('../../../common/modules/about/aboutView.js');

DC.Views.App = module.exports = AppView.extend({

  sections: {
    projects: new Projects(),
    blog: new Blog(),
    resume: new Resume(),
    about: new About()
  },

  initialize: function() {
    AppView.prototype.initialize.apply(this, arguments);
    this.listenTo(this.sections.blog, 'interaction:selectedPost', this.onInteractionSelectedPost.bind(this));
  },

  createRoutes: function () {
    AppView.prototype.createRoutes.apply(this, arguments);
    this.router.route('blog/:postId("/")', 'postId', this.routePostId.bind(this));
  },

  routePostId: function (paramPostId) {
    var postsModel = this.sections.blog.posts.model;

    postsModel.hydrate().then(function () {
      if (!postsModel.get(paramPostId)) {
        this.build(this.sections.blog);
        this.router.navigate(this.sections.blog.name, {trigger: false, replace: true});
      } else {
        mixpanel.track('Viewing single post' + paramPostId);
        this.build(this.sections.blog, paramPostId);
        this.slidebar.hideSelector();
      }
    }.bind(this));
  },

  onInteractionSelectedPost: function () {
    this.navbar.$el.addClass('headroom-pinned').removeClass('closed');
  }
});