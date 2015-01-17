var Portfolio = require('../../../common/modules/portfolio/portfolioView.js'),
    Home = require('../../../common/modules/home/home.js'),
    Projects = require('../../../common/modules/projects/projectsView.js'),
    Resume = require('../../../common/modules/resume/resumeView.js');
    // About = require('../about/aboutView.js'),

DC.Views.Portfolio = module.exports = Portfolio.extend({
  sections: {
    home: new Home(),
    projects: new Projects(),
    resume: new Resume(),
    about: null //new About()
  },

  initialize: function() {
    Portfolio.prototype.initialize.apply(this, arguments);
    this.listenTo(this.sections.home, 'interaction:selectedPost', this.onInteractionSelectedPost.bind(this));
  },

  onInteractionSelectedPost: function () {
    this.navbar.$el.addClass('headroom-pinned').removeClass('closed');
    this.$el.toggleClass('single-post', this.sections.home.selectedPost() !== null);
  }
});