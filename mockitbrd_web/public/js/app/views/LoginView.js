define(['MB', 'jquery', 'hbs!templates/login', 'backbone', 'marionette'],
    function (MB, $, template, Backbone) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend({
            template:template,

            events: {
				'click .MB-modal-close': 'hideModal',
                'click .login': 'loginUser'
            },
            loginUser: function(e) {
                e.preventDefault();

                var email = $('.MB-login-email').val();
                var password = $('.MB-login-password').val();
                var data = {'email': email, 'password': password};

                MB.api.login(data);
            },

            hideModal: function() {
				this.close();
                MB.body.ensureEl();
                MB.body.$el.removeClass('modal-show');
                window.history.back();
            }
        });
    });