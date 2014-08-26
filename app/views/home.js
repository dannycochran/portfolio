Portfolio.Views.Home = Backbone.View.extend({
  name: 'dannycochran',
  className: 'home',

  initialize: function () {
    this.social = new Portfolio.Views.Social({ model: new Portfolio.Models.Social() });
    this.projects = new Portfolio.Views.Projects({ model: new Portfolio.Models.Projects() });
    this.resume = new Portfolio.Views.Resume({ model: new Portfolio.Models.Resume() });
    this.about = new Portfolio.Views.About({ model: new Portfolio.Models.About() });

    this.currentView = null;
  },

  render: function(view) {
    var previousView = this.currentView,
        path = view;

    if (view === 'home') this.currentView = this.social;
    else if (view === 'projects') this.currentView = this.projects;
    else if (view === 'resume') this.currentView = this.resume;
    else if (view === 'about') this.currentView = this.about;

    this.appendSpinner(this.currentView.name);
    globals.router.navigate(path, {trigger: false});

    var callback = function () { // Render the new view after build and teardown are complete
      this.removeSpinner();
      globals.app.navbar.listenTo(this.currentView.model, 'change:scroller', globals.app.navbar.refreshHeadroom);
      globals.app.navbar.resetNavbar();

      this.$el.append(this.currentView.el);

      this.currentView.render();
      // globals.makeLinksExternal();

     _.delay(function () { this.currentView.$el.removeClass('closed'); }.bind(this), 1);

      mixpanel.track('Viewing ' + this.currentView.name);
    }.bind(this);

    this.currentView.build(function () {
      if (previousView !== null) {
        if (previousView && previousView.$el) previousView.$el.addClass('closed');
        _.delay(previousView.teardown.bind(previousView), globals.duration + 100, callback);
      }
      else callback();
    }.bind(this));

    return this;
  },

  appendSpinner: function (view) { this.$el.html(globals.spinTemplate({message: 'Loading ' + view})); },
  removeSpinner: function () { this.$el.find('div.spinner').remove(); }
});