/*
    MBapi
    - Does all API calls and returns JSON objects for use

    Use:
    First make sure "MB" is in the define function

    URL PARAMATER - MB.api.url
    LOGIN USER - MB.api.login(LOGIN_DATA);

    ex of LOGIN DATA = {
                        'email': EMAIL,
                        'paddword': PADDWORD
                    };
----------------------------------------------------

    UPDATE USER - MB.api.update(UPDATE_DATA);

    ex of UPDATE_DATA = {
                            'value_to_update': 'new_value',
                            'value_to_update': 'new_value'
                        } //CAN BE MORE THAT ONE PARAMETER
    e.g. //example of updates isFirst database value and first name value
    var data = {'isFirst': 1, 'fname': 'Earl'};
    MB.api.update(data);

*/
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
                            $('.MB-login-error').html(response.data.error);
                            $('.MB-login-alert').css('display', 'table');
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
            update: function(param) {

            },
            register: function(params) {
                var self = this;
                $.ajax({
                    type: "POST",
                    url: this.get('url') + "v1/user/register",
                    data: params,
                    dataType: 'json',
                    success: function (response) {
                        if (response.success === 0) {
                            console.log(response);
                            $('.fullReg').button('reset');
                            if (response.data.code === 'MBREG101') {
                                $('.MB-reg-error').html(response.data.error).append(' try ', $('<a href="#login">Logging in</a>'));
                                $('.MB-reg-alert').css('display', 'table');
                            }
                        } else {
                            $('.MB-registration-form').hide();
                            $('.MB-reg-name').html(response.data.registeredUser.fname);
                            $('.MB-reg-email').html(response.data.registeredUser.email);
                            $('.MB-reg-success').addClass('hatch');
                        }
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