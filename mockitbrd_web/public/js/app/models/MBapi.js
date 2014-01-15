define(["jquery", "underscore", "backbone"],
    function($, _, Backbone) {
        // Creates a new Backbone Model class object
        var MBapi = Backbone.Model.extend({

            defaults: {
                url: "http://api.mockitbrd.com/"
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
                            alert("error: ", response.data.error); //TODO-(Fara) : add to Error Modal
                        } else {
                            MB.session.start(response.data.user); //add  ", params.stayLoggedIn"
                          //TODO-(Earl) - Create BLANK Landing views with words (interviewer, candidate, or verify) - DO THIS IN MB.session
                          //TODO FIGURE OUT DUPLILCATE SESSIONS AND CLOSE ON SUCCESS
                        }
                    },
                    error: function(response) {
                        alert("error! ", response); //TODO-(Fara): add to Error Modal
                    }
                });
            }
        });

        // Returns the Model class
        return  MBapi;

    }

);