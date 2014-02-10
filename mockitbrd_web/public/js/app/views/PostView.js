define(['moment', 'jquery', 'models/Model', 'views/MBConfirm', 'views/CommentView', 'autogrow', 'hbs!templates/post', 'backbone', 'marionette'],
    function (moment, $, Model, MBConfirm, CommentView, autogrow, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          events: {
            'click .delete-post': "deletePost",
            'click .comment-section textarea': "autgrowArea",
            'click .MB-post-like': "postLikeHandler",
            'keyup .comment-section textarea': 'submitCommentByEnter'
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
          var post_html = MB.helper.replaceURLWithHTMLLinks(this.post.post);

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
          this.post.currentUser = this.currentUser._id;

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
        if (this.post.comments) {
          for (var i = 0; i < this.post.comments.length; i++) {
              var comment = new CommentView({'comment': this.post.comments[i], 'poster_id': this.post.user_id});
              this.renderComment(comment);
            }
          }
      },
      renderComment: function(comment) {
         var selector = '.user-post-comments';
         var html = this.template(this.model.toJSON());
         this.$el.find(selector).prepend(comment.render().el);
      },
      autgrowArea: function(e) {
        $(e.currentTarget).autogrow();
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
      },
       postLikeHandler: function(e) {
        var starEvent = $(e.currentTarget).attr('starevent');
        var postId = $(e.currentTarget).data('postid');
        var poster = $(e.currentTarget).data('posterid');
        var send = {'user': this.currentUser._id, 'what_id': postId, 'what': 'post', 'poster': poster};
        var postLikes = parseInt($('.post_likes[data-postid="' + postId +'"]').text()) || 0;
        console.log(postLikes);
        if (starEvent === 'star') {
          if (poster === this.currentUser._id) {
             MB.api.star(send);
           } else {
             MB.api.star(send, poster);
           }
           if ((postLikes+=1) === 0) {
                postLikes = 0;
                $('.post_likes[data-postid="' + postId +'"]').fadeOut();
              }
            else {
               $('.post_likes[data-postid="' + postId +'"]').hide().html((postLikes)).fadeIn('slow');
            }
        } else if (starEvent === 'unstar') {
          MB.api.unstar(send);
          if ((postLikes-=1) === 0) {
              postLikes = 0;
              $('.post_likes[data-postid="' + postId +'"]').fadeOut();
            } else {
               $('.post_likes[data-postid="' + postId +'"]').hide().html((postLikes )).fadeIn('slow');
            }
        }
      },
      submitCommentByEnter: function(e) {
        var postId = $(e.currentTarget).data('postid');
        commented = null;
        var commentSection = '#comments_' + postId;
        var commentTextArea = '.comment_area_' + postId;
        var poster =  $(e.currentTarget).data('poster');
        send = {'comment': $.trim($(e.currentTarget).val()), 'date': moment(new Date()).format(), 'likes': [], 'user_id': this.currentUser._id};
        if (e.which == 13 && ! e.shiftKey) {
          if ($.trim($(e.currentTarget).val())) {
            commented = MB.api.comment(send, postId, poster);

            if (commented.changed) {
              $(commentTextArea).val('');
              var com = new CommentView({'comment': commented.comment, 'post_id': postId});
              this.renderComment(com);
            }
          } else {
              $('.comment-error').html('Please enter comment!');
          }
        }
      }
     });
});