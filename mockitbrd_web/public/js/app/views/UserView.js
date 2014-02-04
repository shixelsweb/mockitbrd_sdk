define(['jquery', 'models/Model', 'views/PostView', 'hbs!templates/user', 'backbone', 'marionette' ,'edit'],
    function ($, Model, PostView, template, Backbone, editable) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          events: {
            'click .MB-user-star': 'handleStarring',
            'click .MB-edit-profile': 'profileEditMode',
            'click .user-profile-edit-section': 'userSectionEditMode',
            'mouseover .MB-user-star i': "onHoverStar",
            'mouseout .MB-user-star i': "unhoverStar"
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
          userPosts: [],
          skillPack: [],

          initialize:function(options) {

            this.user = options.user;
            this.currentUser = MB.api.user($.parseJSON(MB.session.give('session')).user);
            if (this.currentUser.interactions) {
              this.isStarred = this.checkIfStarred(this.currentUser.interactions.starred, this.user._id);
            } else {
              this.isStarred = false;
            }
            
            if (this.user.user_pic === '0') {
              this.user_pic = MB.api.userpic("default");
            } else if (this.user.user_pic === '1') {
              this.user_pic = MB.api.userpic(this.user._id);
            }
            this.isConnectedActive = this.checkIfConnected(this.currentUser.connections, this.user._id);

            if(this.user._id === this.currentUser._id) {
              this.isOwner = true;
            } else {
              this.isOwner = false;
              
            }
            this.skillPack = [];

            if (this.user.skills) {
              for (var i = 0; i < this.user.skills.length; i++) {
                var skills = this.user.skills[i];
                var category = Object.getOwnPropertyNames(skills)[0];
                var skillSet = {"category": category.replace("-", " "), "skills": skills[category]};
                this.skillPack.push(skillSet);
              }
            }

            

            this.model = new Model ({
              user: this.user, 
              isOwner: this.isOwner, 
              user_pic: this.user_pic,
              isStarred: this.isStarred,
              isConnectedPending: this.isConnectedPending,
              isConnectedActive: this.isConnectedActive,
              notConnected: this.notConnected,
              skills: this.skillPack
            });
          },
          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);

            //replace only the contents of the #list element
            


            $('.left-menu-item').removeClass('active');

            if (this.isOwner) {
              $('.MB-profile').addClass('active');
            } else {
               $('.MB-connections').addClass('active');
            }
            if (this.user.posts) {
              for (var i = 0; i < this.user.posts.length; i++) {
                var post = new PostView({'post': this.user.posts[i].post_id});
                this.renderPost(post);               
              }
            } 
          },
          renderPost: function(post) {
             var selector = '.user-posts';
             var html = this.template(this.model.toJSON());
             this.$el.find(selector).prepend(post.render().el);
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
          },
          profileEditMode: function() {
            $.fn.editable.defaults.mode = 'inline';

            $('.user_profile_job_status').editable({
                type: 'select',
                pk: 1,
                url: '/post',
                title: 'Job Status',
                source: [
                  {value: 1, text: 'Actively Seeking Employement'},
                  {value: 2, text: 'Not Actively Seeking Employement'},
                  {value: 3, text: 'Hired!'},
                  {value: 4, text: 'Currently Employed'}
               ]

            });

            $('.user_profile_job_title').editable({
                type: 'text',
                pk: 1,
                url: '/post',
                title: 'Job Title',

            });

            $('.user_profile_location').editable({
                type: 'text',
                pk: 1,
                url: '/post',
                title: 'Location',

            });
          },
          userSectionEditMode: function(e) {
            $.fn.editable.defaults.mode = 'inline';
            var section = $(e.currentTarget).data('section');

            if (section === 'bio') {

              $('.user-bio').editable({
                type: 'textarea',
                pk: 1,
                url: '/post',
                title: 'Bio',

              });
            }
          },
          onHoverStar: function(e) {
            $(e.currentTarget).removeClass('fa-star-o').addClass('fa-star');
          },
          unhoverStar: function(e) {
            $(e.currentTarget).removeClass('fa-star').addClass('fa-star-o');
          }
     });
});