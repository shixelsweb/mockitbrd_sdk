/*
    MBapi
    - Does all API calls and returns JSON objects for use

    Use:
    First make sure "MB" is in the define function

    URL PARAMATER - MB.api.url
    LOGIN USER - MB.api.login(LOGIN_DATA)

    ex of LOGIN DATA = {
                        'email': EMAIL,
                        'paddword': PADDWORD
                    };

*/
define(["jquery", "underscore", "backbone"],
    function($, _, Backbone) {
        // Creates a new Backbone Model class object
        var MBapi = Backbone.Model.extend({

            defaults: {
                url: "http://api.mockitbrd.com/",
                registered_user: null
            },

            initialize: function() {
                _.bindAll(this);
            },

            //TODO: remember email, stay logged in (increase session time), only login if status is active
            login: function(params) {
                $.ajax({
                    type: "POST",
                    url: this.get('url') + "v1/user/verify_user",
                    data: params,
                    dataType: 'json',
                    success: function (response) {
                        if (response.success === 0) {
                            $('#MB-login-error').html(response.data.error);
                        } else {
                            MB.session.start(response.data.user); //add  ", params.stayLoggedIn"
                          //TODO-(Earl) - Create BLANK Landing views with words (interviewer, candidate, or verify) - DO THIS IN MB.session
                          //TODO FIGURE OUT DUPLILCATE SESSIONS AND CLOSE ON SUCCESS
                        }
                    },
                    error: function(response) {
                        alert("error! ", response.data.error); //TODO-(Fara): add to Error Modal
                    }
                });
            },
            register: function(params) {
                $.ajax({
                    type: "POST",
                    url: this.get('url') + "v1/user/register",
                    data: params,
                    dataType: 'json',
                    success: function (response) {
                        this.set({'registered_user': response.data.user});
                        return response.success;
                        //MB.appRouter.navigate('#register', { trigger: true });
                    },
                    error: function (response) {
                        alert("error: ", response.data.error); //TODO-(Fara) : add to Error Modal
                    }
                });
            }
        });

        // Returns the Model class
        return  MBapi;

    }

);