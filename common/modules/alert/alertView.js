Portfolio.Views.Alert = module.exports = Backbone.View.extend({
  className: 'alert closed',
  template: _.template(require('./_alert.html')),

  events: { 'click i.fa-times': 'closeAlert' },

  initialize: function () { this.listenTo(this.model, 'alert', this.showAlert); },

  render: function () {
    this.$el.html(this.template());
    this.$content = this.$el.find('span');
    return this;
  },

  showAlert: function (alert) {
    this.$content.html(alert);
    this.$el.removeClass('closed');
    _.delay(function () { this.closeAlert(); }.bind(this), Ayasdi.READ_DURATION);
  },

  closeAlert: function () { this.$el.addClass('closed'); }
});
