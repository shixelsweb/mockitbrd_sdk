define(['jquery', 'hbs!templates/register', 'backbone', 'marionette'],
    function ($, template, Backbone) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend({
            template:template,

            account_type: null,
            user_type: null,

            events: {
				'click .MB-modal-close': 'hideModal',
                'click .account-type': 'accountTypeHandler',
                'click .user-type': 'userTypeHandler'
            },
            initialize: function() {
                _.bindAll(this, 'on_keyup');
                $(document).bind('keyup', this.on_keyup);
            },

            onRender: function () {
              // get rid of that pesky wrapping-div
              // assumes 1 child element.
              this.$el = this.$el.children();
              this.setElement(this.$el);
            },

            hideModal: function(e) {
                this.closeModal();
            },

            on_keyup: function(e) {
                if (e.keyCode === 27) {
                    $(document).unbind('keyup', this.on_keyup);
                    this.closeModal();
                }
            },

            closeModal: function() {
                this.close();
                MB.body.ensureEl();
                MB.body.$el.removeClass('modal-show');
                window.history.back();
            },

            accountTypeHandler: function(e) {
                var user_right = $('.user-type.right');
                var user_left = $('.user-type.left');

                this.account_type = $(e.currentTarget).data('accounttype');

                $('.MB-choose-user-type').css("visibility", "hidden");
                $('div.account-type').removeClass('selected');
                $('div.user-type').removeClass('selected');
                $(e.currentTarget).addClass('selected');

                if (this.account_type === 'business') {
                    $('.MB-choose-user-type').css('visibility', 'visible');
                    console.log(user_left, user_right);
                    user_left.html("Higher Education");
                    $('.user-type.right').html("Enterprise");
                } else if (this.account_type === 'personal') {
                    $('.MB-choose-user-type').css('visibility', 'visible');
                    user_left.html("Interviewer");
                    $('.user-type.right').html("Candidate");
                }

            },

            userTypeHandler: function(e) {
                this.user_type = $(e.currentTarget).innerText;
                $('div.MB-reg-form').css("visibility", "hidden");
                $('div.user-type').removeClass('selected');
                $(e.currentTarget).addClass('selected');

            }
        });
    });