var Portfolio = require('../../../common/modules/portfolio/portfolioView.js'),
    Home = require('../../../common/modules/home/home.js');
    // Projects = require('../projects/projectsView.js'),
    // Resume = require('../resume/resumeView.js'),
    // About = require('../about/aboutView.js'),

DC.Views.Portfolio = module.exports = Portfolio.extend({
  sections: {
    home: new Home(),
    projects: null, // new Projects(),
    resume: null, //new Resume(),
    about: null //new About()
  },

  initialize: function() {
    Portfolio.prototype.initialize.apply(this, arguments);
    // this.listenTo(this.model, 'show:posts', this.onShowPosts);
  },

  // onShowPosts: function (showPosts) {
  //   this.slidebar.$el.toggleClass('closed', !showPosts);
  //   this.navbar.$el
  //     .toggleClass('single-post', !showPosts)
  //     .addClass('headroom-pinned')
  //     .removeClass('closed');
  //   this.home.social.posts.showPosts(showPosts);
  // },
});