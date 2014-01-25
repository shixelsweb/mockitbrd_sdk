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
                var send = null;
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
                            MB.appRouter.navigate('dashboard', {trigger: true});
                        }
                        send = response.data.success;
                    },
                    error: function(response) {
                        alert("error! ", response); //TODO-(Fara): add to Error Modal
                    },
                    async: false
                });

                return send;
            },
            logout: function() {
                MB.cookie.clear('MB-session-user');
                MB.cookie.clear('MB-session-auth-token');
                MB.cookie.clear('MB-session-user-type');

                MB.appRouter.navigate('', {trigger: true});
            },
            getUserTasks: function(user_id) {
                var send = null;
                $.ajax({
                    type: "GET",
                    url: this.get('url') + "v1/user/tasks/" + user_id,
                    dataType: 'json',
                    success: function (response) {
                        send = response.data.userTasks;
                    },
                    error: function(response) {
                        alert("error! ", response.data.error); //TODO-(Fara): add to Error Modal
                    },
                    async: false
                });

                return send;
            },
            getUserTasksFull: function(user_id) {
                var self = this;
                var send = null;
                var tasks = [];
                $.ajax({
                    type: "GET",
                    url: this.get('url') + "v1/user/tasks/" + user_id,
                    dataType: 'json',
                    success: function (response) {
                        if (response.data.userTasks) {
                            for(var i = 0; i < response.data.userTasks.length; i++) {
                                tasks.push(self.task(response.data.userTasks[i].task_id));
                            }
                        }
                    },
                    error: function(response) {
                        alert("error! ", response.data.error); //TODO-(Fara): add to Error Modal
                    },
                    async: false
                });

                return tasks;
            },
            user: function(user_id) {
                var send = null;
                $.ajax({
                    type: "GET",
                    url: this.get('url') + "v1/user/" + user_id,
                    dataType: 'json',
                    success: function (response) {
                        send = response.data.user;
                    },
                    error: function(response) {
                        alert("error! ", response.error); //TODO-(Fara): add to Error Modal
                    },
                    async: false
                });

                return send;
            },
            task: function(task_id) {
                var send = null;
                $.ajax({
                    type: "GET",
                    url: this.get('url') + "v1/tasks/" + task_id,
                    dataType: 'json',
                    success: function (response) {
                        send = response.data.task;
                    },
                    error: function(response) {
                        alert("error! ", response.data.error); //TODO-(Fara): add to Error Modal
                    },
                    async: false
                });

                return send;
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
                        alert("error: ", response); //TODO-(Fara) : add to Error Modal
                    }
                });
            },
            star: function(params) {
                $.ajax({
                    type: 'PUT',
                    url: this.get('url') + 'v1/user/star',
                    data: params,
                    dataType: 'json',
                    success: function(response) {
                        if (response.success === 0) {
                            $('MB-user-star').removeClass('fa-star-o').addClass('fa-star');
                        } else {
                            alert('error: ', response.data.error);
                        }
                    },
                    error: function(response) {
                            alert('error: ', response);
                    }
                });
            },
            unstar: function(params) {
                $.ajax({
                    type: 'PUT',
                    url: this.get('url') + 'v1/user/unstar',
                    data: params,
                    dataType: 'json',
                    success: function(response) {
                        if (response.success === 0) {

                        } else {
                        }
                    },
                    error: function(response) {

                    }
                });
            }
        });

        // Returns the Model class
        return  MBapi;

    }

);