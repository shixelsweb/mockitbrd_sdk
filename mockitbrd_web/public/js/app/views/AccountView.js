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
      hash: '#user/52c4ca13de46e88f00770b62/account',

      events:{
        'click .account-menu-item': 'accountMenuHandler'
      },
      

      initialize: function(options) {
        
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

        $(e.currentTarget).removeClass('active')

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

        window.location.hash = this.hash + '/' + navTarget;
        $("#accountViewRegion").html(this.view.render().el);
      }

      
  });
});