define(['jquery', 'models/Model', 'views/MBConfirm', 'moment', 'hbs!templates/notification', 'backbone', 'marionette'],
    function ($, Model, MBConfirm, moment, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({

          template:template,
          model: null,
          notification: null,
          currentUser: null,

          events: {
            'click .MB-user-unconnect': 'denyUser',
            'click .MB-user-accept': 'acceptUser',
            'click .MB-mark-read': 'markRead'
          },

          initialize: function (options) {
            this.notification = options.notification;
            this.currentUser = MB.api.user($.parseJSON(MB.session.give('session')).user);
            this.notification.by_who = MB.api.user(this.notification.by_who);
            this.notification.when = moment(this.notification.date).fromNow();
            if (parseInt(this.notification.read) === 0 && this.notification.type !== 'connction') {
                this.notification.notReadandNotConnection = true;
            } else if (parseInt(this.notification.read) === 1 && this.notification.type !== 'connction') {
                this.notification.isRead = true;
                 this.notification.done_message = 'Read';
                  this.notification.readClass = 'read';
            }
            if (this.currentUser.connections) {
              for (var i = 0; i < this.currentUser.connections.length; i++) {
                if(this.currentUser.connections[i].user_id === this.notification.by_who._id) {
                  if (this.currentUser.connections[i].status === 'active') {
                    this.notification.isRead = true;
                    if (this.notification.type === 'connction') {
                          this.notification.done_message = 'Connected';
                      } else {
                        this.notification.readClass = 'unread';
                        this.notification.isRead = false;
                      }
                    if (parseInt(this.notification.read) === 1) {
                      this.notification.readClass = 'read';
                      this.notification.done_message = 'Read';
                    } else {
                      this.notification.notReadAndConnected = true;
                      this.notification.isRead = false;
                    }
                  } else if (this.currentUser.connections[i].status === 'pending') {
                      if (this.notification.type === 'connection') {
                         this.notification.connectionAndNotActive = true;
                      }
                    if (parseInt(this.notification.read) === 1) {
                      this.notification.readClass = 'read';
                      this.notification.done_message = 'Read';
                    }
                  }
                }
              }
            }
            console.log(this.notification);

            this.model = new Model ({
              notification: this.notification
            });
          },
          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
          },
          denyUser: function(e) {
            var denyCommands = new Backbone.Wreqr.Commands();
            var self = this;
            var changed = null;
            var send = {'user': this.currentUser._id, 'connect_to': $(e.currentTarget).data('notificationwho')};
            var currentNotNum = parseInt($('.MB-new-count p').text());
            var notId = $(e.currentTarget).data('notificationid');
            var sendNot = {'user': this.currentUser._id, 'not_id': notId};
            var not = '.not_' + notId;
            MB.body.ensureEl();
            MB.body.$el.addClass('modal-black-show');
            denyCommands.addHandler('yes', function(){
            changed = MB.api.unconnect(send); //unconnect users
              if (changed) {
                //remove notification from your database
                  if ((currentNotNum-=1) === 0) {
                    $('.MB-new-count').fadeOut();
                  } else {
                      $('.MB-new-count p').hide().html((currentNotNum)).fadeIn('slow');
                  }
                  var notChanged = MB.api.notification(sendNot, 'remove');
                  console.log(notChanged);
                  if (notChanged) {
                    $(not).fadeOut(300, function() { $(this).remove(); });
                  }
              }
            });
            MB.confirmRegion.show( new MBConfirm({commands: denyCommands, 'title': 'Are you sure you want to unconnect from this user?', 'body': 'You will need to reconnect and be approved in the future.'}));
          },
          acceptUser: function(e) {
            var notId = $(e.currentTarget).data('notificationid');
            var menuToChange = '#not_' + notId + '_menu';
            var not = '.not_' + notId;
            var notMess = (notType = 'connection') ? 'Connected' : 'Read';
            var currentNotNum = parseInt($('.MB-new-count p').text());
            var connectedCheck = null;
            var notChanges = null;
            var send = {'user': this.currentUser._id, 'connect_to': $(e.currentTarget).data('notificationwho')};
            var notSend = {'user': this.currentUser._id, 'not_id': notId};

            connectedCheck = MB.api.acceptUser(send);

            if (connectedCheck) {
              notChanges = MB.api.notification(notSend, 'read');
              if (notChanges) {
                $(not).addClass('read');
                if ((currentNotNum-=1) === 0) {
                  $('.MB-new-count').fadeOut();
                } else {
                  $('.MB-new-count p').hide().html((currentNotNum)).fadeIn('slow');
                }
              }
            }
            $(menuToChange).hide().html('<li class="notification-thanks">' + notMess + ' <i class="fa fa-check"></i></li>').fadeIn('slow');
          },
          markRead: function(e) {
            var notId = $(e.currentTarget).data('notificationid');
            var menuToChange = '#not_' + notId + '_menu';
            var send = {'user': this.currentUser._id, 'not_id': notId};
            var notType = $(e.currentTarget).data('notificationtype');
            var not = '.not_' + notId;
            var currentNotNum = parseInt($('.MB-new-count p').text());

            var changed = MB.api.notification(send, 'read');

            if(changed) {
              if ((currentNotNum-=1) === 0) {
                $('.MB-new-count').fadeOut();
              } else {
                $('.MB-new-count p').hide().html((currentNotNum)).fadeIn('slow');
              }

              $(not).addClass('read');
              $(menuToChange).html('<li class="notification-thanks">Read <i class="fa fa-check"></i></li>');
            }
          }
      });
});