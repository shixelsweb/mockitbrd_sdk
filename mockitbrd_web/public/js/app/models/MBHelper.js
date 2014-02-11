define(["jquery", "backbone"],
    function($, Backbone) {
        // Creates a new Backbone Model class object
        var MBHelper = Backbone.Model.extend({

            initialize: function() {
                var MB = MB;
                _.bindAll(this);
            },

            replaceURLWithHTMLLinks: function(text) {
              var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
              return text.replace(exp,"<a href='$1' target='_blank'>$1</a>") || text; 
            },

            message: function(type) {
                switch(type) {
                    case 'connection': return "would like to connect with you"; break;
                    case 'accepted': return "accepted your request"; break;
                    case 'liked_comment': return "liked your comment"; break;
                    case 'liked_post': return "liked your post"; break;
                    case 'commented': return "commented on your post"; break;
                    case 'liked_you': return "added you as a favorite"; break;
                }
            },
            getPostsToShow: function(user) {
                var posts = [];
                var myPosts = [];
                var usersPosts = {};
                var myPost = {};
                var connection = null;
                if (user.connections) {
                  for (var i = 0; i < user.connections.length; i++) {
                      connection = MB.api.user(user.connections[i].user_id);
                    if (connection.posts && connection.posts.length > 0) {
                      for (var j = 0; j < connection.posts.length; j++) {
                        usersPosts.user_id = connection._id;
                        usersPosts.post_id = connection.posts[j];
                        posts.push(usersPosts);
                      }
                    }
                  }
                }
                if (user.posts && user.posts.length > 0) {
                  for (var k = 0; k < user.posts.length; k++) {
                        myPost.user_id = user._id;
                        myPost.post_id = user.posts[k];
                        myPosts.push(myPost);
                  }
                }
                var returnPosts = posts.concat(myPosts);
                return returnPosts;
            }

        });

        // Returns the Model class
        return  MBHelper;

    }

);