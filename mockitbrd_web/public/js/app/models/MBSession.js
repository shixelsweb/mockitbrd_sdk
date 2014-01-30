define(["jquery", "backbone", "json", "session"],
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

            start: function(user) { //add stayLoggedIn
                var auth_token = this.generateToken();
                if (!this.get('MB-session')) { //only create a session if one doesn't already exsist

                    this.setSession('MB-session', {'user': user.user_id, 'token': auth_token, 'user_type': user.user_type});
                    MB.appRouter.navigate('dashboard', {trigger: true});
                }
            },

            dumpSession: function() {
                return Session.dump();
            },

            setSession: function (name, value) {
                Session.set(name, value);
            },

            getSession: function(name) {
                return Session.get(name);
            },

            clearSession: function(name) {
                Session.clear(name);
            }


        });

        // Returns the Model class
        return  MBSession;

    }

);