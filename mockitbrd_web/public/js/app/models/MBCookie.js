define(["jquery", "cookie", "backbone"],
    function($, cookie, Backbone) {
        // Creates a new Backbone Model class object
        var MBCookie = Backbone.Model.extend({

            initialize: function() {
                _.bindAll(this);
            },

            all: function() {
                return $.cookie();
            },

            set: function (name, value, exp) {
                if (exp) {
                    $.cookie(name, value, {expires: exp});
                } else {
                    $.cookie(name, value);
                }
            },

            get: function(name) {
                return $.cookie(name);
            },

            clear: function(name) {
                $.removeCookie(name);
            }

        });

        // Returns the Model class
        return  MBCookie;

    }

);