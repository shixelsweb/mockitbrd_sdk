define([
  //VIEWS 
  'views/AccountNotificationsView',
  'views/AccountPaymentView',
  'views/AccountSupportView',
  'views/AccountGeneralView',
  'views/AccountSecurityView',
  'views/AccountMediaView',

  //DEPENDENCIES
  'jquery', 
  'models/Model', 
  'hbs!templates/account', 
  'backbone', 
  'marionette'
  ],
  function (
  //VIEWS
  AccountNotificationsView,
  AccountPaymentView,
  AccountSupportView,
  AccountGeneralView,
  AccountSecurityView,
  AccountMediaView,
  //DEPENDENCIES
  $,
  Model,
  template,
  Backbone
  ){
  //ItemView provides some default rendering logic
  return Backbone.Marionette.ItemView.extend({
      template:template,

      model: null,
      view: null,
      hash: null,

      events:{
        'click .account-menu-item': 'accountMenuHandler'
      },
      

      initialize: function(options) {
        this.hash = '#user/' + $.parseJSON(MB.session.give('session')).user + '/account';
      },

      onRender: function () {
        // get rid of that pesky wrapping-div
        // assumes 1 child element.
        this.$el = this.$el.children();
        this.setElement(this.$el);
        $('.left-menu-item').removeClass('active');
        $('.MB-account-settings').addClass('active');
      },

      accountMenuHandler: function(e) {
        var navTarget = $(e.currentTarget).data('accountnavigate');
        var isLoggedIn = MB.session.give('session');

        $(e.currentTarget).removeClass('active');

        if (navTarget === 'security') {
          this.view = new AccountSecurityView();
        } else if (navTarget === 'general') {
          this.view = new AccountGeneralView();
        } else if (navTarget === 'billing') {
          this.view = new AccountPaymentView();
        } else if (navTarget === 'social') {
          this.view = new AccountMediaView();
        } else if (navTarget === 'support') {
          this.view = new AccountSupportView();
        } else if (navTarget === 'notifications') {
          this.view = new AccountNotificationsView();
        }

        if (isLoggedIn) {
          window.location.hash = this.hash + '/' + navTarget;
          $("#accountViewRegion").html(this.view.render().el);
        } else {
          MB.appRouter.navigate('login', {trigger: true});
          $('.MB-login-error').html('You must be logged in to view that page!');
        }
      }

      
  });
});