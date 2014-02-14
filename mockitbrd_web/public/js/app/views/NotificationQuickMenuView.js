define(['underscore', 'jquery', 'models/Model', 'views/MBConfirm', 'views/NotificationView', 'hbs!templates/notificationquickmenu', 'backbone', 'marionette'],
    function (_, $, Model, MBConfirm, NotificationView, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({

          template:template,
          model: null,
          notifications: null,
          currentUser: null,

          events: {
            'click #MB-mark-all-nots-read': 'markAllRead',
            'click .MB-notification-quick-menu': 'clickAnywhereOnMenu',
            'click .MB-user-notifications': 'clickAnywhereOnMenu'
          },

          initialize: function () {
            this.currentUser = MB.api.user($.parseJSON(MB.session.give('session')).user);
            this.notifications = this.currentUser.app_config.notifications;
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
            var self = this;
            //get rid of that pesky wrapping-div
            //assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
            if (this.notifications) {
              for (var i = 0; i < this.notifications.length; i++) {
                var notification = this.notifications[i];
                var not = new NotificationView({notification: notification});
                this.renderNotification(not);

              }
            }

          },
          renderNotification: function(notification) {
           var selector = '.MB-user-notifications';
           var html = this.template(this.model.toJSON());
           this.$el.find(selector).prepend(notification.render().el);
        },
        markAllRead: function(e) {
          e.stopPropagation();
          var send = null;
          var done = null;
          var not = null;
          var currentNotNum = null;
          var menuToChange = null;
          if (this.notifications) {
            for (var i = 0; i < this.notifications.length; i++) {
              if (this.notifications[i].read === '0') {
                send = {'user': this.currentUser._id, 'not_id': this.notifications[i]._id};
                done = MB.api.notification(send, 'read');
                not = '.not_' + this.notifications[i]._id;
                menuToChange = '#not_' + this.notifications[i]._id + '_menu';
                currentNotNum = parseInt($('.MB-new-count p').text())
                if(done) {
                  if ((currentNotNum-=1) === 0) {
                      $('.MB-new-count').fadeOut();
                    } else {
                      $('.MB-new-count p').hide().html((currentNotNum)).fadeIn('slow');
                    }

                    $(not).addClass('read');
                    $(menuToChange).html('<li class="notification-thanks">Read <i class="fa fa-check"></i></li>');
                }
              }
            }
          }
        },
        clickAnywhereOnMenu: function(e) {
          e.stopPropagation();
        }
      });
});