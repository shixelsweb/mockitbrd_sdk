define(['underscore', 'jquery', 'models/Model', 'views/MBConfirm', 'views/NotificationView', 'hbs!templates/notificationquickmenu', 'backbone', 'marionette'],
    function (_, $, Model, MBConfirm, NotificationView, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({

          template:template,
          model: null,
          notifications: null,
          currentUser: null,

          events: {
          },

          initialize: function () {
            this.currentUser = MB.api.user($.parseJSON(MB.session.give('session')).user);
            this.notifications = this.currentUser.notifications;
            var new_count = 0;

            if (this.notifications) {
              for(var i = 0; i < this.notifications.length; i++) {
                if (this.notifications[i].read === '0') {
                  new_count+=1;
                }
              }
            }

            this.model = new Model({user: this.currentUser, new_count: new_count});
          },
          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
            $('.MB-user-notifications').html('');
            if (this.notifications) {
              for (var i = 0; i < this.notifications.length; i++) {
                var notification = this.notifications[i];
                var not = new NotificationView({notification: notification});
                this.renderNotification(not);

              }
            }
            $('body').on('click', function(){
              $('.MB-notification-quick-menu').remove();
              $('body').off('click');
            });

          },
          renderNotification: function(notification) {
           var selector = '.MB-user-notifications';
           var html = this.template(this.model.toJSON());
           this.$el.find(selector).prepend(notification.render().el);
        }
      });
});