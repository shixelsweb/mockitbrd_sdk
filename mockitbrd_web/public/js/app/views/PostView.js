define(['jquery', 'models/Model', 'hbs!templates/post', 'backbone', 'marionette'],
    function ($, Model, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          events: {

          },

          model: null,
          user: null,
          currentUser: null,

          initialize:function(options) {

          this.user = options.user;
          this.currentUser = MB.api.user($.parseJSON(MB.session.give('session')).user);

          var post = MB.api.post(options.post);
          var post_html = this.replaceURLWithHTMLLinks(post.post);
          
          if (this.currentUser.user_pic === '0') {
            post.user_pic = MB.api.userpic("default");
          } else if (this.currentUser.user_pic === '1') {
            post.user_pic = MB.api.userpic(this.currentUser._id);
          }
          
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
            if (commenter.user_pic === '0') {
              comment.user_pic = MB.api.userpic("default");
            } else if (commenter.user_pic === '1') {
              comment.user_pic = MB.api.userpic(comment.user_id);
            }
          }

          if (!this.isOwner) { //only make api call for user info if post is not by current user
            var poster = MB.api.user(post.user_id);
            post.poster = poster.fname + " " + poster.lname;
            post.isOwner = false;
            if (poster.user_pic === '0') {
              post.commenter_pic = MB.api.userpic("default");
            } else if (poster.user_pic === '1') {
              post.commenter_pic = MB.api.userpic(post.user_id);
            }
          } else {
            if (this.user.user_pic === '0') {
              post.commenter_pic = MB.api.userpic("default");
            } else if (this.user.user_pic === '1') {
              post.commenter_pic = MB.api.userpic(post.user_id);
            }
            post.poster = this.user.fname + " " + this.user.lname;
            post.isOwner = true;
          }
          post.post = post_html;
          post.isConnectedActive = this.isConnectedActive;
            
          this.model = new Model ({
            post: post
          });
      },
      onRender: function () {
        // get rid of that pesky wrapping-div
        // assumes 1 child element.
        this.$el = this.$el.children();
        this.setElement(this.$el);

        $('.user-posts').prepend(this.$el);
      },
      replaceURLWithHTMLLinks: function(text) {
          var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
          return text.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 
      }
     });
});