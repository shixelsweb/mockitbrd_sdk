define(['jquery', 'models/Model', 'views/MBConfirm', 'hbs!templates/post', 'backbone', 'marionette'],
    function ($, Model, MBConfirm, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          events: {
            'click .delete-post': "deletePost"
          },

          model: null,
          user: null,
          currentUser: null,
          isOwner: null,
          post: null,

          initialize:function(options) {

          this.user = MB.api.user(options.user);
          this.currentUser = MB.api.user($.parseJSON(MB.session.give('session')).user);
          if(this.user._id === this.currentUser._id) {
              this.isOwner = true;
          } else {
            this.isOwner = false;
            
          }

          this.post = MB.api.post(options.post);
          var post_html = this.replaceURLWithHTMLLinks(this.post.post);
          
          if (this.post.likes) {
            for (var k = 0; k < this.post.likes.length; k++) {
                var likes = this.post.likes[k];
                if (this.currentUser._id === likes.user_id) {
                  this.post.isLiked = true;
                  break
                } else {
                  this.post.isLiked = false;
                }
              }
            this.post.likes_count = this.post.likes.length;
          }

          if (this.post.comments) {
            for (var j = 0; j < this.post.comments.length; j++) {
              var comment = this.post.comments[j];
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
            }
          }

          if (!this.isOwner) { //only make api call for user info if post is not by current user
            var poster = MB.api.user(this.post.user_id);
            this.post.poster = poster.fname + " " + poster.lname;
            this.post.isOwner = false;
          } else {
            this.post.poster = this.user.fname + " " + this.user.lname;
            this.post.isOwner = true;
          }
          this.post.post = post_html;
          this.post.isConnectedActive = this.isConnectedActive;
            
          this.model = new Model ({
            post: this.post
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
          return text.replace(exp,"<a href='$1' target='_blank'>$1</a>") || text; 
      },
      deletePost: function(e) {
        var self = this;
        MB.body.ensureEl();
        MB.body.$el.addClass('modal-black-show');
        var deleteCommand = new Backbone.Wreqr.Commands();
        deleteCommand.addHandler('yes', function(){
          MB.api.deletePost({'post_id': self.post._id, 'user_id': self.currentUser._id});
        });
        MB.confirmRegion.show( new MBConfirm({commands: deleteCommand, 'title': 'Are you sure you want to delete this post?', 'body': 'Post deleted cannot be retrieved'}));
      }
     });
});