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
            }

        });

        // Returns the Model class
        return  MBHelper;

    }

);