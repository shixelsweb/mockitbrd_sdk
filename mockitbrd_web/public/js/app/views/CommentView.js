define(['moment', 'jquery', 'models/Model', 'views/MBConfirm', 'hbs!templates/comment', 'backbone', 'marionette'],
    function (moment, $, Model, MBConfirm, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,
          poster: null,

          events: {
            'click .MB-comment-like': 'commentLikeHandler'
          },

          model: null,
          currentUser: null,
          comment: null,

          initialize:function(options) {
          this.comment = options.comment;
          this.currentUser = MB.api.user($.parseJSON(MB.session.give('session')).user);
          var commenter = MB.api.user(this.comment.user_id);
          this.poster = options.poster_id;
          if (this.comment.likes) {
            for (var k = 0; k < this.comment.likes.length; k++) {
              var likes = this.comment.likes[k];
              if (this.currentUser._id === likes.user_id) {
                this.comment.isLiked = true;
                break
              } else {
                this.comment.isLiked = false;
              }
            }
            this.comment.likes_count = this.comment.likes.length;
          }

          this.comment.date = moment(this.comment.date).format('MMMM Do YYYY, h:mma');
          this.comment.comment = MB.helper.replaceURLWithHTMLLinks(this.comment.comment);
          this.comment.commenter = commenter.fname + " " + commenter.lname;
          this.comment.commenterid = commenter._id;
          this.model = new Model ({
            comment: this.comment
          });
      },
      onRender: function () {
        // get rid of that pesky wrapping-div
        // assumes 1 child element.
        this.$el = this.$el.children();
        this.setElement(this.$el);
        //$('.user-post-comments').prepend(this.$el);
      },
      autgrowArea: function(e) {
        $(e.currentTarget).autogrow();
      },
      commentLikeHandler: function(e) {
        var starEvent = $(e.currentTarget).attr('starevent');
        var commentID = $(e.currentTarget).data('commentid');
        var send = {'user': this.currentUser._id, 'what_id': commentID, 'what': 'comment', 'poster': this.poster};
        var commentLikes = parseInt($('.comment-likes[data-commentid="' + commentID +'"]').text());
        var person = $(e.currentTarget).attr('person');
        if (starEvent === 'star') {
          if (person === this.currentUser._id) {
             MB.api.star(send);
           } else {
             MB.api.star(send, person);
           }
           if ((commentLikes+=1) === 0) {
              $('.comment-likes[data-commentid="' + commentID +'"]').fadeOut();
            } else {
               $('.comment-likes[data-commentid="' + commentID +'"]').hide().html((commentLikes)).fadeIn('slow');
            }
        } else if (starEvent === 'unstar') {
          MB.api.unstar(send);
          if ((commentLikes-=1) === 0) {
              $('.comment-likes[data-commentid="' + commentID +'"]').fadeOut();
            } else {
               $('.comment-likes[data-commentid="' + commentID +'"]').hide().html((commentLikes )).fadeIn('slow');
            }
        }
      }
     });
});