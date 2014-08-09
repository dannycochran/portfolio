Portfolio.Views.About = Backbone.View.extend({
  tagName: 'ol',
  className: 'about closed',
  name: 'about',

  template: _.template($('#about-template').html()),
  formTemplate: _.template($('#form-template').html()),

  events: {
    'submit': 'sendMessage'
  },

  render: function () {
    if (this.$el.find('li.background-image').length > 0) return;

    _.each(this.model.get('things'), function (thing) {
      this.$el.append(this.template({thing: thing}));
    }.bind(this));
    this.$el.append(this.formTemplate());

    this.$email = this.$el.find('#email'); this.$emailErr = this.$el.find('#emailErr');
    this.$name = this.$el.find('#name'); this.$nameErr = this.$el.find('#nameErr');
    this.$message = this.$el.find('#message'); this.$messageErr = this.$el.find('#messageErr');
    this.$submit = this.$el.find('.submit-button');
    this.$status = this.$el.find('#messageStatus');

    if ($.os.phone || $.os.tablet) this.$el.addClass('hover-off');
    this.listenTo(this.model, 'alert', this.onMessageStatus);

    return this;
  },

  build: function (callback) {
    if (this.model.isHydrated()) callback();
    else {
      this.listenToOnce(this.model, 'hydrate', callback);
      this.model.hydrate();
    }
  },

  validateEmail: function (email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  },

  submitSuccess: function () {
    this.model.trigger('alert', {
      message: 'Thanks! I will reply to your message within a few days.',
      type: 'success'
    });
  },

  submitFailure: function () {
    this.model.trigger('alert', {
      message: 'Something went wrong, please try again.',
      type: 'error'
    });
  },

  onMessageStatus: function (alert) {
    this.$el.find('div.spinner').remove();
    mixpanel.track('Email submission ' + alert.type);

    this.$status.html(alert.message);
    this.$status.removeClass('disappear');
    if (alert.type === 'error') this.$status.addClass('error');
    else this.$status.removeClass('error');

    _.delay(function () { this.$status.addClass('disappear'); }.bind(this), 5000);
  },

  sendMessage: function (e) {
    var email = this.$email.val(), validEmail = this.validateEmail(email),
        name = this.$name.val(), validName = name.length > 0,
        message = this.$message.val(), validMessage = message.length > 0,
        credentials = {
          email: email, name: name, message: message
        };
    if (validEmail && validName && validMessage) {
      this.$email.val(''); this.$name.val(''); this.$message.val('');
      this.$emailErr.html(''); this.$nameErr.html(''); this.$messageErr.html('');
      this.$submit.blur();
      this.$el.append(globals.spinTemplate({message: 'Sending message'}));
      $.ajax({
        type: 'POST',
        url: '/email',
        data: credentials,
        complete: function (xhr, status) {
          if (xhr.status == 200) this.submitSuccess(); else this.submitFailure();
        }.bind(this)
      });
    } else {
      if (!validEmail) this.$emailErr.html('Please enter a valid email address.');
      else this.$emailErr.html('');

      if (!validName) this.$nameErr.html('Please enter your name.');
      else this.$nameErr.html('');

      if (!validMessage) this.$messageErr.html('Please enter a brief message.');
      else this.$messageErr.html('');
    }
    return false;
  },

  teardown: function (callback) {
    callback();
  }
});