define(['jquery', 'hbs!templates/register', 'backbone', 'marionette'],
    function ($, template, Backbone) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend({
            template:template,

            defaults: {
                password_ready: null,
                fname_ready: null,
                lname_ready: null,
                rpassword_ready: null,
                email_ready: null,
                user_type_ready: null,
                toc_ready: null
            },

            events: {
				'click .MB-modal-close': 'hideModal',
                'click .account-type': 'accountTypeHandler',
                'propertychange input.MB-reg-input': 'on_form_change',
                'input input.MB-reg-input': 'on_form_change',
                'paste input.MB-reg-input': 'on_form_change',
                'focus .reg-password': 'show_tooltip',
                'click .reg-password': 'show_tooltip',
                'hover .reg-password': 'show_tooltip',
                'click .reg-roles': 'explain_roles',
                'hover .reg-roles': 'explain_roles',
                'click .fullReg': 'registerUser'
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
            show_tooltip: function() {
                var password_html = '<h2>Password Help</h2><p class="step1">1. Must be at least 8 character long</p><p class="step2">2. Must contain at least 1 uppercase letter</p><p class="step3">3. Must contain at least 1 lowercase letter</p><p class="step4">4. Must containt at least 1 number (0-9)</p>';
                $('.reg-password').tooltip({'trigger':'focus click hover', 'title': password_html, 'html': true, delay: {hide: 100}});
            },
            explain_roles: function(e) {
                e.preventDefault();
                var roles_html = "<h2>Candidate</h2><p>Get interviewed by industy professionals and land your next job!</p><h2>Interviewer</h2><p>An interviewer's role is to interview candidates, and earn cash in the process</p>";
                $('.reg-roles').popover({'trigger':'click', 'placement': 'top', 'title': 'User Types', 'content': roles_html, 'html': true, delay: {hide: 100}});
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
            registerUser: function(e) {
                e.preventDefault();
                $(e.currentTarget).button('loading');
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
                    if (target.value.length >= 8) {
                        $('.step1').css('color', '#2bbbff');
                    } else {
                        $('.step1').css('color', '#fff');
                    }

                    if (this.contains_upper(target.value)) {
                        $('.step2').css('color', '#2bbbff');
                    } else {
                        $('.step2').css('color', '#fff');
                    }

                    if (this.contains_lower(target.value)) {
                        $('.step3').css('color', '#2bbbff');
                    } else {
                        $('.step3').css('color', '#fff');
                    }

                    if (this.contains_number(target.value)) {
                        $('.step4').css('color', '#2bbbff');
                    } else {
                        $('.step4').css('color', '#fff');
                    }

                    if ((target.value.length >= 8) && this.contains_upper(target.value) && this.contains_number(target.value) && this.contains_lower(target.value)) {
                        $('.reg-password').tooltip('destroy');
                        $(successIndicator).css('visibility', 'visible');
                        $(successIndicator).css('display', 'inline');
                        $(failIndicator).css('display', 'none');
                    } else if ((target.value.length < 8) || !this.contains_upper(target.value) || this.contains_number(target.value) || this.contains_lower(target.value)) {
                        $(failIndicator).css('visibility', 'visible');
                        $(failIndicator).css('display', 'inline');
                        $(successIndicator).css('display', 'none');
                    }
                } else if ((targetClass === 'reg-password') && !target.value) {
                    $('.reg-password').tooltip('destroy');
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