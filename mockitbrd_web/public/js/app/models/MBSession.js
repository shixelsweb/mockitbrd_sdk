define(["jquery", "backbone", "cookie"],
    function($, Backbone, cookie) {
        // Creates a new Backbone Model class object
        var MBSession = Backbone.Model.extend({
            defaults: {
                user: $.cookie('MB-session-user') || null,
                token: $.cookie('MB-session-auth-token') || null,
                user_type: $.cookie('MB-session-user-type') || null
            },

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
                //TODO: Remove password from user object
                if (!this.get('user') && !this.get('token')) { //only create a session if one doesn't already exsist

                    this.set ({
                        'user':  MB.cookie.set('MB-session-user', JSON.stringify(user)),
                        'token': MB.cookie.set('MB-session-auth-token', auth_token),
                        'user_type': MB.cookie.set('MB-session-user-type', user.user_type),
                    });

                    //this.load(user.user_type, user.status);
                }
            },

            load: function (user_type, isAdmin, user_status) {
                //  //TODO-(Earl) - put handeling of login location here
                // if (user_status === 'active') {
                //     switch (isAdmin) {
                //         case 0: {
                //             if (user_type === "interviewer") {
                //                 //SHOW INTERVIEWER LANDING VIEW
                //             } else if (user_type === "candidate") {
                //                 //SHOW CANDIDATE LANDING VIEW
                //             }
                //             break;
                //         }
                //         case 1:{
                //             break;
                //         } //SHOW ADMIN VIEW
                //     }
                // } else if (user_status === 'pending') {
                //     //SHOW NAVIFATE TO VERIFY EMAIL VIEW
                // }
            }

        });

        // Returns the Model class
        return  MBSession;

    }

);