define(['jquery','models/Model', 'hbs!templates/leftAppMenu', 'backbone', 'marionette'],
    function ($, Model, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          user: null,
          notView: null,
          payView: null,
          supView: null,
          genView: null,
          secView: null,
          medView: null,


          events: {
            'click .left-menu-item': 'onLeftMenuClick',
            'click .MB-left-app-menu-button': 'onLeftAppMenuButtonClick',
            'click .MB-account-settings': 'showAccountSettingSubMenu',
            'click .MB-account-settings-submenu li': 'handleTabClick',
            'click .MB-account-settings.active': 'hideAccountSettingSubMenu'
          },
          initialize: function(options) {
            this.user = MB.api.user($.parseJSON(MB.session.get('user')));
            this.notView = options.notificationView;
            this.payView = options.paymentView;
            this.supView = options.supportView;
            this.genView = options.generalView;
            this.secView = options.securityView;
            this.medView = options.mediaView;

            this.model = new Model({user: this.user});
          },
          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
          },
          onLeftMenuClick: function(e) {
            $('.left-menu-item').removeClass('active');
            $(e.currentTarget).addClass('active');
          },
          onLeftAppMenuButtonClick: function(e) {
            e.preventDefault();

            if ($('.MB-left-app-menu').css('left') === '0px') {
              $('.MB-left-app-menu').css('left', '-180px');
              $('.MB-left-app-menu-button').css('left', '0px');
            } else {
              $('.MB-left-app-menu').css('left', '0px');
              $('.MB-left-app-menu-button').css('left', '180px');
            }
          },
          showAccountSettingSubMenu: function(e) {
            $(e.currentTarget).addClass('active');
            $('.MB-account-settings-submenu').slideDown();
          },
          hideAccountSettingSubMenu: function(e) {
            $(e.currentTarget).removeClass('active');
            $('.MB-account-settings-submenu').slideUp();
          },
          handleTabClick: function(e) {
            var view = $(e.currentTarget).data('navigate');

            $('.Account-menu-item').removeClass('active');
            $(e.currentTarget).addClass('active');

            if (view === "nots") {
              $("#accountViewRegion").html(this.notView.render().el);
            } else if (view === "general") {
              $("#accountViewRegion").html(this.genView.render().el);
            } else if (view === "pay") {
              $("#accountViewRegion").html(this.payView.render().el);
            } else if (view === "support") {
              $("#accountViewRegion").html(this.supView.render().el);
            } else if (view === "security") {
              $("#accountViewRegion").html(this.secView.render().el);
            } else if (view === "media") {
              $("#accountViewRegion").html(this.medView.render().el);
            } 

          }
      });
});