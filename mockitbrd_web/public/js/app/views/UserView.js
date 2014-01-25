define(['jquery', 'models/Model', 'hbs!templates/user', 'backbone', 'marionette'],
    function ($, Model, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          events: {
            'click .MB-user-star': 'handleStarring'
          },

          model: null,
          user: null,
          currentUser: null,
          isOwner: null,
          user_pic: null,
          isStarred: null,
          isConnectedActive: null,
          isConnectedPending: null,
          notConnected: null,

          initialize:function(options) {

            this.user = options.user;
            this.currentUser = MB.api.user($.parseJSON(MB.session.get('user')));
            this.isStarred = this.checkIfStarred(this.currentUser.interactions.starred, this.user._id);
            this.isConnectedActive = this.checkIfConnected(this.currentUser.connections, this.user._id);

            if(this.user._id === this.currentUser._id) {
              this.isOwner = true;
              this.user_pic = this.currentUser.user_pic.file_path  + '/' + this.currentUser.user_pic.file_name;
            } else {
              this.isOwner = false;
              this.user_pic = 'https://s3-us-west-2.amazonaws.com/mockitbrd/users/' + this.user._id + '/user_pic.jpg';
            }
            this.model = new Model ({
              user: this.user, 
              isOwner: this.isOwner, 
              user_pic: this.user_pic,
              isStarred: this.isStarred,
              isConnectedPending: this.isConnectedPending,
              isConnectedActive: this.isConnectedActive,
              notConnected: this.notConnected
            });
          },
          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
            $('.left-menu-item').removeClass('active');

            if (this.isOwner) {
              $('.MB-profile').addClass('active');
            } else {
               $('.MB-connections').addClass('active');
            }
          },
          checkIfConnected: function(connections, profile_viewing) {
            var connectionCheck = false;

            if (connections) {
              for (var i = 0; i < connections.length; i++) {
                if(connections[i].user_id === profile_viewing) {
                    if (connections[i].status === 'pending') {
                      this.isConnectedPending = true;
                    } else if (connections[i].status === 'active'){
                      connectionCheck = true;
                    }
                }
              }
            } else {
              connectionCheck = false;
              this.notConnected = true;
            }
            console.log(connectionCheck, this.isConnectedPending);
            return connectionCheck;

          },
          checkIfStarred: function(stars, profile_viewing) { //check to see if user is favorited (starred) by the current session user 
            var starCheck = false;

            if (stars) {
              for (var i = 0; i < stars.length; i++) {
                if (stars[i].user_id === profile_viewing) {
                  starCheck = true;
                } else {
                  starCheck = false;
                }
              }
            } else {
              starCheck = false;
            }
            return starCheck;
          },
          handleStarring: function(e) {
            var starEvent = $(e.currentTarget).data('starevent');
            var params = {
              'user': this.currentUser._id,
              'user_toStar': this.user._id
            };

            if (starEvent === 'star') {
              MB.api.star(params);
            } else if (starEvent === 'unstar') {
              MB.api.unstar(params);
            }
          }
    });
});