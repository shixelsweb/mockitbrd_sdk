/*
    MBCookie
    - Helps create, delete, and get browser cookies. Utilizies the JQuery $.cookie library

    Use:
    First make sure "MB" is in the define function

    SHOW ALL COOKIES - MB.cookie.all();
    CREATE A COOKIE - MB.cookie.set('COOKIE_NAME', 'COOKIE_VALUE', COOKIE_EXP); - only pass in COOKIE_EXP if you want to set a specific amount of days for expire
    GET VALUE OF A COOKIE - MB.cookie.get('COOKIE_NAME');
    DELETE A COOKIE - MB.cookie.clear('COOKIE_NAME');

    ex of COOKIE_NAME = 'MB-session-user'
*/
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