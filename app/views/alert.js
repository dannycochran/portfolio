// Ayasdi Inc. Copyright 2014 - all rights reserved.

Portfolio.Views.Alert = Backbone.View.extend({
  name: 'alert',
  className: 'alert closed',
  template: _.template($('#alert-template').html()),

  events: {
    'click i.fa-times': 'closeAlert'
  },

  initialize: function () { this.listenTo(this.model, 'alert', this.showAlert); },

  render: function () {
    this.$el.html(this.template());
    this.$content = this.$el.find('span');
    return this;
  },

  showAlert: function (alert) {
    this.$el.removeClass('success error');
    this.$content.html(alert.message);
    this.$el.removeClass('closed').addClass(alert.type);
    _.delay(function () {
      this.closeAlert();
    }.bind(this), globals.duration * 10);
  },

  closeAlert: function () {
    this.$el.addClass('closed');
  }
});
