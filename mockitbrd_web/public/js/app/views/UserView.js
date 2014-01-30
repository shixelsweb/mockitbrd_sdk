define(['jquery', 'models/Model', 'hbs!templates/user', 'backbone', 'marionette' ,'edit'],
    function ($, Model, template, Backbone, editable) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          events: {
            'click .MB-user-star': 'handleStarring',
            'click .MB-edit-profile': 'profileEditMode',
            'click .user-profile-edit-section': 'userSectionEditMode'
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
            this.currentUser = MB.api.user(MB.session.getSession('MB-session').user);
            this.isStarred = this.checkIfStarred(this.currentUser.interactions.starred, this.user._id);
            this.user_pic = MB.api.userpic(this.user._id);
            this.isConnectedActive = this.checkIfConnected(this.currentUser.connections, this.user._id);

            if(this.user._id === this.currentUser._id) {
              this.isOwner = true;
            } else {
              this.isOwner = false;
              
            }
            this.userPosts = [];
            this.skillPack = [];

            if (this.user.skills) {
              for (var i = 0; i < this.user.skills.length; i++) {
                var skills = this.user.skills[i];
                var category = Object.getOwnPropertyNames(skills)[0];
                var skillSet = {"category": category.replace("-", " "), "skills": skills[category]};
                this.skillPack.push(skillSet);
              }
            }

            if (this.user.posts && this.userPosts.length === 0) {
              for (var i = 0; i < this.user.posts.length; i++) {
                var post = MB.api.post(this.user.posts[i].post_id);
                var post_html = this.replaceURLWithHTMLLinks(post.post);
                post.commenter_pic = MB.api.userpic(this.currentUser._id);
                
                if (post.likes) {
                  for (var k = 0; k < post.likes.length; k++) {
                      var likes = post.likes[k];
                      if (this.currentUser._id === likes.user_id) {
                        post.isLiked = true;
                        break
                      } else {
                        post.isLiked = false;
                      }
                    }
                  post.likes_count = post.likes.length;
                }

                for (var j = 0; j < post.comments.length; j++) {
                  var comment = post.comments[j];
                  var commenter = MB.api.user(comment.user_id);
                  var comment_html = this.replaceURLWithHTMLLinks(comment.comment);

                  if (comment.likes) {
                    for (var k = 0; k < comment.likes.length; k++) {
                      var likes = comment.likes[k];
                      if (this.currentUser._id === likes.user_id) {
                        comment.isLiked = true;
                        break
                      } else {
                        comment.isLiked = false;
                      }
                    }
                    comment.likes_count = comment.likes.length;
                  }

                  comment.comment = comment_html;
                  comment.commenter = commenter.fname + " " + commenter.lname;
                  comment.user_pic = MB.api.userpic(comment.user_id);
                }

                if (!this.isOwner) { //only make api call for user info if post is not by current user
                  var poster = MB.api.user(post.user_id);
                  post.poster = poster.fname + " " + poster.lname;
                  post.isOwner = false;
                } else {
                  post.poster = this.user.fname + " " + this.user.lname;
                  post.isOwner = true;
                }
                post.post = post_html;
                post.isConnectedActive = this.isConnectedActive;
                post.user_pic = MB.api.userpic(post.user_id);
                this.userPosts.push(post);
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
              posts: this.userPosts,
              skills: this.skillPack
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
          replaceURLWithHTMLLinks: function(text) {
              var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
              return text.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 
          }
    });
});