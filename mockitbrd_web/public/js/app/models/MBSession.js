define(["jquery", "backbone"],
    function($, Backbone) {
        // Creates a new Backbone Model class object
        var MBSession = Backbone.Model.extend({

            initialize: function() {
                var MB = MB;
                
                _.bindAll(this);
            },

            generateToken: function () {
                var MAX = 9e15;
                var MIN = 1e15;
                var safegap = 1000;
                var counter = MIN;

                var increment = Math.floor(safegap*Math.random());
                if(counter > (MAX - increment)) {
                    counter = MIN;
                }
                counter += increment;
                return counter.toString(36);
            },

            give: function(name) {
                return localStorage.getItem(name);
            },

            begin: function(name, value) {
                localStorage.setItem(name, value);
            },

            start: function(user) { //add stayLoggedIn
                var auth_token = this.generateToken();
                var sessionUser = JSON.stringify({'user': user.user_id, 'token': auth_token, 'user_type': user.user_type});
                if (!this.give('session')) { //only create a session if one doesn't already exsist

                    localStorage.setItem('session', sessionUser);
                    MB.appRouter.navigate('dashboard', {trigger: true});
                }
            },

            clear: function(name) {
                localStorage.removeItem('session');
            }


        });

        // Returns the Model class
        return  MBSession;

    }

);