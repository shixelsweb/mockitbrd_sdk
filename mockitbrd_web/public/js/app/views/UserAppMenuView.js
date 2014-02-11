define(['jquery','views/MBConfirm', 'views/NotificationQuickMenuView', 'models/Model', 'hbs!templates/userAppMenu', 'backbone', 'marionette'],
    function ($, MBConfirm, NotificationQuickMenuView, Model, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          user: null,
          model: null,
          not_count: 0,
          notQuickMenu: null,

          events: {
            'click .MB-user-menu-menu': 'logout',
            'click .MB-notification-icon': 'showQuickMenu',
            'click .MB-notification-icon.showing': 'hideQuickMenu'
          },

          initialize: function() {
            this.user = MB.api.user($.parseJSON(MB.session.give('session')).user);
            if (this.user.notifications) {
              for(var i = 0; i < this.user.notifications.length; i++) {
                if (this.user.notifications[i].read === '0') {
                  this.not_count+=1;
                }
              }
            }
            this.model = new Model({user: this.user, user_pic: this.user_pic, new_count: this.not_count});
          },

          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
            return this;
          },

          logout: function(e) {
            MB.body.ensureEl();
            MB.body.$el.addClass('modal-black-show');
            var lougoutApp = new Backbone.Wreqr.Commands();

            lougoutApp.addHandler('yes', function(){
              MB.api.logout();
              MB.appRouter.navigate('dashboard', {trigger: true});
            });
            MB.confirmRegion.show( new MBConfirm({commands: lougoutApp, 'title': 'You are about to logout', 'body': 'Are you sure you want to logout?'}));
          },
          showQuickMenu: function(e) {
            e.stopPropagation();
            this.notQuickMenu = new NotificationQuickMenuView();
            MB.notMenuRegion.show(this.notQuickMenu);

            $('body').on('click', this.hideQuickMenu);
          },
          hideQuickMenu: function(e) {
            e.stopPropagation();
            MB.notMenuRegion.currentView.remove();
            $('body').off('click');
          }
      });
});