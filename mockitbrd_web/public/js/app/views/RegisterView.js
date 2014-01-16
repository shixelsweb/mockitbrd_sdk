define(['jquery', 'hbs!templates/register', 'backbone', 'marionette'],
    function ($, template, Backbone) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend({
            template:template,

            defaults: {
                account_type: null,
                user_type: null
            },

            events: {
				'click .MB-modal-close': 'hideModal',
                'click .account-type': 'accountTypeHandler',
                'propertychange input.MB-reg-input': 'on_form_change',
                'input input.MB-reg-input': 'on_form_change',
                'paste input.MB-reg-input': 'on_form_change'
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
            on_form_change: function(e) {
                var successIndicator = "i." + e.currentTarget.classList[1] + ".success.fa.fa-check-circle";
                var failIndicator = "i." + e.currentTarget.classList[1] + ".fail.fa.fa-times-circle";
                var targetClass = e.currentTarget.classList[1];
                var target = e.currentTarget;

                if ((targetClass === 'reg-fname') && target.value) {
                    $(successIndicator).css('visibility', 'visible');
                    $(successIndicator).css('display', 'inline');
                    $(failIndicator).css('display', 'none');
                } else if ((targetClass === 'reg-fname') && !target.value) {
                    $(successIndicator).css('visibility', 'hidden');
                    $(successIndicator).css('display', 'inline');
                    $(failIndicator).css('display', 'none');
                }

                if ((targetClass === 'reg-lname') && target.value) {
                    $(successIndicator).css('visibility', 'visible');
                    $(successIndicator).css('display', 'inline');
                    $(failIndicator).css('display', 'none');
                } else if ((targetClass === 'reg-lname') && !target.value) {
                    $(successIndicator).css('visibility', 'hidden');
                    $(successIndicator).css('display', 'inline');
                    $(failIndicator).css('display', 'none');
                }

                if ((targetClass === 'reg-email') && target.value) {
                    if (this.validateEmail(target.value)) {
                        $(successIndicator).css('visibility', 'visible');
                        $(successIndicator).css('display', 'inline');
                        $(failIndicator).css('display', 'none');
                    } else if (!this.validateEmail(target.value)) {
                         $(failIndicator).css('visibility', 'visible');
                         $(failIndicator).css('display', 'inline');
                         $(successIndicator).css('display', 'none');
                    }
                } else if ((targetClass === 'reg-email') && !target.value) {
                    $(failIndicator).css('visibility', 'hidden');
                    $(successIndicator).css('display', 'inline');
                    $(successIndicator).css('visibility', 'hidden');
                    $(failIndicator).css('display', 'none');
                }

                if ((targetClass === 'reg-password') && target.value) {
                    if ((target.value.length >= 8) && this.contains_upper(target.value) && this.contains_number(target.value) && this.contains_lower(target.value)) {
                        $(successIndicator).css('visibility', 'visible');
                        $(successIndicator).css('display', 'inline');
                        $(failIndicator).css('display', 'none');
                    } else if ((target.value.length < 8) || !this.contains_upper(target.value) || this.contains_number(target.value) || this.contains_lower(target.value)) {
                         $(failIndicator).css('visibility', 'visible');
                         $(failIndicator).css('display', 'inline');
                         $(successIndicator).css('display', 'none');
                    }
                } else if ((targetClass === 'reg-password') && !target.value) {
                    $(failIndicator).css('visibility', 'hidden');
                    $(failIndicator).css('display', 'none');
                    $(successIndicator).css('display', 'inline');
                    $(successIndicator).css('visibility', 'hidden');
                }

                if ((targetClass === 'reg-rpassword') && target.value) {
                    console.log(target.value, $('.reg-password')[0].value);
                      if (target.value === $('.reg-password')[0].value) {
                        $(successIndicator).css('visibility', 'visible');
                        $(successIndicator).css('display', 'inline');
                        $(failIndicator).css('display', 'none');
                    } else if (target.value !== $('.reg-rpassword').value) {
                         $(failIndicator).css('visibility', 'visible');
                         $(failIndicator).css('display', 'inline');
                         $(successIndicator).css('display', 'none');
                    }
                } else if ((targetClass === 'reg-rpassword') && !target.value) {
                    $(failIndicator).css('visibility', 'hidden');
                    $(failIndicator).css('display', 'none');
                    $(successIndicator).css('display', 'inline');
                    $(successIndicator).css('visibility', 'hidden');
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

            },
            validateEmail: function(email) {
                var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                return (regex.test(email));
            },
            contains_number: function(password) {
                var regex = /\d/;

                return (regex.test(password));
            },
            contains_upper: function(password) {
                var regex = /(?=.*[A-Z])/;

                return (regex.test(password));
            },
            contains_lower: function(password) {
                var regex = /(?=.*[a-z])/;

                return (regex.test(password));
            },
            getClientIP: function() {
                if (window.XMLHttpRequest) {
                    xmlhttp = new XMLHttpRequest();
                } else {
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }

                xmlhttp.open("GET","http://api.hostip.info/get_html.php",false);
                xmlhttp.send();

                hostipInfo = xmlhttp.responseText.split("\n");

                for (i=0; hostipInfo.length >= i; i++) {
                    ipAddress = hostipInfo[i].split(":");
                    if ( ipAddress[0] == "IP" ) return ipAddress[1];
                }

                return false;
            }
        });
    });