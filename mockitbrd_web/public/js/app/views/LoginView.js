define(['MB', 'jquery', 'hbs!templates/login', 'backbone', 'marionette', 'toggle'],
    function (MB, $, template, Backbone, toggle) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend({
            template:template,

            events: {
				'click .MB-modal-close': 'hideModal',
                'click #Log-Button': 'loginUser'
            },
            initialize: function() {
                _.bindAll(this, 'on_keyup');
                $(document).bind('keyup', this.on_keyup);
            },

            onRender: function() {
                $(':checkbox').iphoneStyle();
                console.log($(':checkbox').iphoneStyle());
            },

            loginUser: function(e) {
                e.preventDefault();

                var email = $('.MB-login-email').val();
                var password = $('.MB-login-password').val();
                //var stayLoggedIn = value;
                //if user hasnt entered email or password do a validation before sending to API
                var data = {'email': email, 'password': password};


                MB.api.login(data);
            },

            hideModal: function(e) {
                this.closeModal();
            },

            on_keyup: function(e) {
                if (e.keyCode === 27) {
                    $(document).unbind('keyup', this.on_keyup);
                    this.closeModal();
                } else if (e.keyCode === 27) {
                    $(document).unbind('keyup', this.on_keyup);
                    this.loginUser();
                }
            },

            closeModal: function() {
                this.close();
                MB.body.ensureEl();
                MB.body.$el.removeClass('modal-show');
                window.history.back();
            }

        });
    });

