define(['MB', 'jquery', 'hbs!templates/contact', 'backbone', 'marionette'],
    function (MB, $, template, Backbone) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend({
            template:template,

            events: {
				'click .MB-modal-close': 'hideModal',
                'click .MB-contact-submit-button': 'submitForm'
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

            submitForm: function(e) {
                e.preventDefault();

                var data = {};

                data.contactName = $('#contactName').val();
                data.contactSubject = $('#contactSubject').val();
                data.contactEmail = $('#contactEmail').val();
                data.contactMessage = $('#contactMessage').val();

                var message = data.contactMessage + " - " + data.contactName;

                if ((data.contactName === "") && (data.contactEmail  === "") && (data.contactMessage  === "") && (data.contactSubject === "" ))  {
                    $('#MB-contact-error-msg').html('Please fill all fields!').css('display', 'table');
                } else {
                    MB.email.start({'title': data.contactSubject, 'email': 'me@faraashiru.com', 'message': message, 'type:': data.contactEmail});
                }

                console.log(data);
            },

            closeModal: function() {
                this.close();
                MB.body.ensureEl();
                MB.body.$el.removeClass('modal-show');
                window.history.back();
            }
        });
    });