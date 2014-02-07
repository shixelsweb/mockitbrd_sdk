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
define(["jquery", "underscore", "backbone", "views/PostView"],
    function($, _, Backbone, PostView) {
        // Creates a new Backbone Model class object
        var MBapi = Backbone.Model.extend({

            defaults: {
                api_url: null,
                bucket_url: 'https://s3-us-west-2.amazonaws.com/mockitbrd/'
            },

            initialize: function() {
                _.bindAll(this);

                if (MB.env === 'dev') {
                    this.set({'api_url': 'http://mockitbrdapi-11009.onmodulus.net/'});
                } else if (MB.api_url === 'prod') {
                    this.set({'api_url': 'http://mb.mockitbrd.com/'});
                } else if (MB.env === 'test') {
                    this.set({'api_url': 'http://mockitbrdtest-11011.onmodulus.net/'});
                }
               
            },

            //TODO: remember email, stay logged in (increase session time), only login if status is active
            login: function(params) {
                var send = null;
                $.ajax({
                    type: "POST",
                    url: this.get('api_url') + "v1/user/verify_user",
                    data: params,
                    dataType: 'json',
                    success: function (response) {
                        if (response.success === 0) {
                            $('.MB-login-error').html(response.data.error);
                            $('.MB-login-alert').css('display', 'table');
                        } else {
                            MB.session.start(response.data.user); //add  ", params.stayLoggedIn"
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
                MB.session.clear('session');
                MB.appRouter.navigate('#', {trigger: true});
            },
            getUserTasks: function(user_id) {
                var send = null;
                $.ajax({
                    type: "GET",
                    url: this.get('api_url') + "v1/user/tasks/" + user_id,
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
                    url: this.get('api_url') + "v1/user/tasks/" + user_id,
                    dataType: 'json',
                    success: function (response) {
                        if (response.data.userTasks) {
                            for(var i = 0; i < response.data.userTasks.length; i++) {
                                tasks.push(self.task(response.data.userTasks[i].task_id));
                            }
                        }
                    },
                    error: function(response) {
                        alert("error! ", $.parseJSON(response)); //TODO-(Fara): add to Error Modal
                    },
                    async: false
                });

                return tasks;
            },
            post: function(post_id) { //get a post by its id 
                var send = null;
                $.ajax({
                    type: "GET",
                    url: this.get('api_url') + 'v1/posts/' + post_id,
                    dataType: 'json',
                    success: function(response) {
                        send = response.data.post;
                    },
                    error: function(response) {
                        console.log("error!", response.error);
                    },
                    async: false
                });

                return send;
            },
            user: function(user_id) {
                var send = null;
                $.ajax({
                    type: "GET",
                    url: this.get('api_url') + "v1/user/" + user_id,
                    dataType: 'json',
                    success: function (response) {
                        send = response.data.user;
                    },
                    error: function(response) {
                        console.log("error! ", response.error); //TODO-(Fara): add to Error Modal
                    },
                    async: false
                });

                return send;
            },
            allUsers: function() {
                var send = null;
                $.ajax({
                    type: "GET",
                    url: this.get('api_url') + "v1/users/",
                    dataType: 'json',
                    success: function (response) {
                        send = response.data.users;
                    },
                    error: function(response) {
                        console.log("error! ", response.error); //TODO-(Fara): add to Error Modal
                    },
                    async: false
                });

                return send;
            },
            allCanidates: function() {
                var send = null;
                $.ajax({
                    type: "GET",
                    url: this.get('api_url') + "v1/candidates/",
                    dataType: 'json',
                    success: function (response) {
                        send = response.data.candidates;
                    },
                    error: function(response) {
                        console.log("error! ", response.error); //TODO-(Fara): add to Error Modal
                    },
                    async: false
                });

                return send;
            },
            allInterviewers: function() {
                var send = null;
                $.ajax({
                    type: "GET",
                    url: this.get('api_url') + "v1/interviewers/",
                    dataType: 'json',
                    success: function (response) {
                        send = response.data.interviewers;
                    },
                    error: function(response) {
                        console.log("error! ", response.error); //TODO-(Fara): add to Error Modal
                    },
                    async: false
                });

                return send;
            },
            task: function(task_id) {
                var send = null;
                $.ajax({
                    type: "GET",
                    url: this.get('api_url') + "v1/tasks/" + task_id,
                    dataType: 'json',
                    success: function (response) {
                        send = response.data.task;
                    },
                    error: function(response) {
                        console.log("error! ", response.data.error); //TODO-(Fara): add to Error Modal
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
                    url: this.get('api_url') + "v1/user/register",
                    data: params,
                    dataType: 'json',
                    success: function (response) {
                        if (response.success === 0) {
                            console.log(response);
                            $('.fullReg').button('reset');
                            if (response.data.code === 'MBREG101') {
                                $('.MB-reg-error').html(response.data.error).append(' try ', $('<a href="#login">Logging in</a>'));
                                $('.MB-reg-console.log').css('display', 'table');
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
                        console.log("error: ", response); //TODO-(Fara) : add to Error Modal
                    }
                });
            },
            star: function(params) {
                $.ajax({
                    type: 'PUT',
                    url: this.get('api_url') + 'v1/user/star',
                    data: params,
                    dataType: 'json',
                    success: function(response) {
                        if (response.success === 0) {
                            $('MB-user-star').removeClass('fa-star-o').addClass('fa-star');
                        } else {
                            console.log('error: ', response.data.error);
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
                    url: this.get('api_url') + 'v1/user/unstar',
                    data: params,
                    enctype: 'multipart/form-data',
                    success: function(response) {
                        if (response.success === 0) {

                        } else {
                        }
                    },
                    error: function(response) {

                    }
                });
            },
            uploadPic: function(file, fileTemp) {
                var reader = new FileReader();
                $.ajax({
                    type: 'PUT',
                    url: '/uploadUserpic',
                    data: file,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(response) {   
                        console.log(response);
                        if(response.success === 1) {
                            $('.filebutton').hide();
                            reader.onload = function (e) {
                                $('#user_profile_pic').attr('src', e.target.result);
                                $('.MB-user-menu-image img').attr('src', e.target.result);
                                $('.pic-upload-spinner').fadeOut();
                            };
                            reader.readAsDataURL(fileTemp);
                        }
                        
                    },
                    error: function(response) {
                    }
                });
            },
            postStatus: function(post) {
                $.ajax({
                    type: "POST",
                    url: this.get('api_url') + "v1/post/status",
                    data: post,
                    dataType: 'json',
                    success: function (response) {
                        if (response.success === 0) {
                            $('.MB-post-button').prop('disabled', false);
                             
                            //Add popup here
                        } else {
                            $('.MB-post-button').prop('disabled', false);
                            $('.user-profile-wall-poster-top textarea').val('');
                            var post = new PostView({'user': response.data.post.user_id, 'post': response.data.post._id});
                            $('.user-posts').prepend(post.render().el);
                        }
                        //MB.appRouter.navigate('#register', { trigger: true });
                    },
                    error: function (response) {
                        console.log("error: ", response); //TODO-(Fara) : add to Error Modal
                    }
                });
            },
            deletePost: function(post) {
                var postToRemove = '#post_' + post.post_id;
                $.ajax({
                    type: "DELETE",
                    url: this.get('api_url') + "v1/post/remove",
                    data: post,
                    dataType: 'json',
                    success: function (response) {
                        if (response.success === 0) {                             
                            //Add popup here
                        } else {
                            console.log(postToRemove + ' removed!');
                            $(postToRemove).fadeOut(300, function() { $(this).remove(); });
                        }
                        //MB.appRouter.navigate('#register', { trigger: true });
                    },
                    error: function (response) {
                        console.log("error: ", response); //TODO-(Fara) : add to Error Modal
                    }
                });
            },
            connect: function(connection) {
                var change = '#connect_' + connection.connect_to;
                $.ajax({
                    type: "POST",
                    url: this.get('api_url') + 'v1/user/connect',
                    data: connection,
                    dataType: 'json',
                    success: function(response) {
                        if (response.success === 1) {
                            $('.MB-user-connect').html('Pending');
                            $(change).addClass('disabled');
                            $('.MB-user-connect').removeClass('MB-user-connect');
                        } else {
                            //popup
                        }
                    },
                    error: function(response) {
                        console.log("error: ", response); //TODO-(Fara) : add to Error Modal
                    }
                });
                
            },
            unconnect: function(connection) {
                var change = '#unconnect_' + connection.connect_to;
                $.ajax({
                    type: "DELETE",
                    url: this.get('api_url') + 'v1/user/unconnect',
                    data: connection,
                    dataType: 'json',
                    success: function(response) {
                        if (response.success === 1) {
                            $(change).html('<i class="fa fa-plus"></i>Connect');
                            $(change).removeClass('disabled');
                            $(change).removeClass('MB-user-unconnect');
                        } else {
                            //popup
                        }
                    },
                    error: function(response) {
                        console.log("error: ", response); //TODO-(Fara) : add to Error Modal
                    }
                });
                
            }

        });

        // Returns the Model class
        return  MBapi;

    }

);