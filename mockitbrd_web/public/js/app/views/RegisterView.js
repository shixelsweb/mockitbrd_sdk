define(['jquery', 'hbs!templates/register', 'backbone', 'marionette'],
    function ($, template, Backbone) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend({
            template:template,

            password_html: '<h2>Password Help</h2><p class="step1">1. Must be at least 8 character long</p><p class="step2">2. Must contain at least 1 uppercase letter</p><p class="step3">3. Must contain at least 1 lowercase letter</p><p class="step4">4. Must containt at least 1 number (0-9)</p>',

            defaults: {
                password: {ready: null, value: null},
                fname: {ready: null, value: null},
                lname: {ready: null, value: null},
                rpassword: {ready: null, value: null},
                email: {ready: null, value: null},
                user_type: {ready: false, value: null},
                toc: {ready: null, value: null},
                gender: {ready: false, value: null}
            },

            isReferred: null,

            events: {
				'click .MB-modal-close': 'hideModal',
                'click .user-type': 'userTypeHandler',
                'click .gender-type': 'genderTypeHandler',
                'propertychange .MB-reg-input': 'on_form_change',
                'input  .MB-reg-input': 'on_form_change',
                'paste  .MB-reg-input': 'on_form_change',
                'focus .reg-password': 'show_tooltip',
                'click .reg-password': 'show_tooltip',
                'hover .reg-password': 'show_tooltip',
                'click .reg-roles': 'explain_roles',
                'hover .reg-roles': 'explain_roles',
                'click .fullReg': 'registerUser',
                'click .MB-agree-toc-box': 'toc_check'
            },
            initialize: function() {
                _.bindAll(this, 'on_keyup');
                $(document).bind('keyup', this.on_keyup);

                var getLocation = window.location.href;
                var urlsep = getLocation.split("?");

                this.isReferred = urlsep[1].split("=")[1];

            },

            onRender: function () {
              // get rid of that pesky wrapping-div
              // assumes 1 child element.
              this.$el = this.$el.children();
              this.setElement(this.$el);
            },
            show_tooltip: function() {
                $('.reg-password').tooltip({'trigger':'focus click hover', 'title': this.password_html, 'html': true, delay: {hide: 100}});
            },
            explain_roles: function(e) {
                e.preventDefault();
                var roles_html = "<h2>Candidate</h2><p>Get interviewed by industy professionals and land your next job!</p><h2>Interviewer</h2><p>An interviewer's role is to interview candidates, and earn cash in the process</p>";
                $('.reg-roles').popover({'trigger':'click', 'placement': 'bottom', 'title': 'User Types', 'content': roles_html, 'html': true, delay: {hide: 100}});
            },
            hideModal: function(e) {
                this.closeModal();
            },

            on_keyup: function(e) {
                var email_data = {title: "You're almost there!", email: 'me@faraashiru.com', message: 'HELLO!!!!', type: 'general'};
                if (e.keyCode === 27) {
                    $(document).unbind('keyup', this.on_keyup);
                    this.closeModal();
                }
            },
            registerUser: function(e) {
                e.preventDefault();
                $(e.currentTarget).prop('disabled', true);
                console.log(this.defaults);
                if (this.defaults.password.ready === true &&
                    this.defaults.fname.ready === true &&
                    this.defaults.lname.ready === true &&
                    this.defaults.rpassword.ready === true &&
                    this.defaults.email.ready === true &&
                    this.defaults.user_type.ready === true &&
                    this.defaults.toc.ready === true &&
                    this.defaults.gender.ready === true) {

                    var client_ip = this.getClientIP();
                    var timestamp = new Date().getTime();
                    var reg_send = {
                        'signup_date': timestamp,
                        'fname':  this.defaults.fname.value,
                        'lname':  this.defaults.lname.value,
                        'gender': this.defaults.gender.value,
                        'email':  this.defaults.email.value,
                        'password':  this.defaults.password.value,
                        'client_ip_address':  client_ip,
                        'user_type':  this.defaults.user_type.value,
                        'agree_toc':  this.defaults.toc.value,
                        'active': 0,
                        'user_pic': 0,
                        'referrel_count': 0,
                        'isFirst': 0,
                        'login_count': 0,
                        'liked_by': 0
                    };

                    MB.api.register(reg_send, this.isReferred);

                } else if (this.defaults.password.ready === true &&
                    this.defaults.fname.ready === true &&
                    this.defaults.lname.ready === true &&
                    this.defaults.rpassword.ready === true &&
                    this.defaults.email.ready === true &&
                    this.defaults.user_type.ready === true &&
                    this.defaults.gender.ready === true &&
                    this.defaults.toc.ready === false) {
                    $('.fullReg').prop('disabled', false);
                    $('.MB-reg-error').html('Please accept Terms of Conditions');
                    $('.MB-reg-alert').css('display', 'table');
                } else {
                    $('.fullReg').prop('disabled', false);
                    $('.MB-reg-error').html('Please fill form completely');
                    $('.MB-reg-alert').css('display', 'table');
                }
            },
            toc_check: function(e) {
                if ($(e.currentTarget).attr('checked')) {
                    this.defaults.toc.ready = true;
                    this.defaults.toc.value = 1;
                } else {
                    this.defaults.toc.ready = false;
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
                    this.defaults.fname.ready = true;
                    this.defaults.fname.value = target.value;
                } else if ((targetClass === 'reg-fname') && !target.value) {
                    $(successIndicator).css('visibility', 'hidden');
                    $(successIndicator).css('display', 'inline');
                    $(failIndicator).css('display', 'none');
                    this.defaults.fname.ready = false;
                }

                if ((targetClass === 'reg-lname') && target.value) {
                    $(successIndicator).css('visibility', 'visible');
                    $(successIndicator).css('display', 'inline');
                    $(failIndicator).css('display', 'none');
                    this.defaults.lname.ready = true;
                    this.defaults.lname.value = target.value;
                } else if ((targetClass === 'reg-lname') && !target.value) {
                    $(successIndicator).css('visibility', 'hidden');
                    $(successIndicator).css('display', 'inline');
                    $(failIndicator).css('display', 'none');
                    this.defaults.lname.ready = false;
                }

                 if ((targetClass === 'reg-gender') && (target.value !== 'default')) {
                    this.defaults.gender.ready = true;
                    this.defaults.gender.value = target.value;
                } else if ((targetClass === 'reg-gender') && (target.value === 'default')) {
                    this.defaults.gender.ready = false;
                }

                if ((targetClass === 'reg-email') && target.value) {
                    if (this.validateEmail(target.value)) {
                        $(successIndicator).css('visibility', 'visible');
                        $(successIndicator).css('display', 'inline');
                        $(failIndicator).css('display', 'none');
                        this.defaults.email.ready = true;
                        this.defaults.email.value = target.value;
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
                    this.defaults.email.ready = false;
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
                        this.defaults.password.ready = true;
                        this.defaults.password.value = target.value;
                    } else if ((target.value.length < 8) || !this.contains_upper(target.value) || this.contains_number(target.value) || this.contains_lower(target.value)) {
                        $(failIndicator).css('visibility', 'visible');
                        $(failIndicator).css('display', 'inline');
                        $(successIndicator).css('display', 'none');
                    }
                } else if ((targetClass === 'reg-password') && !target.value) {
                    $(failIndicator).css('visibility', 'hidden');
                    $(failIndicator).css('display', 'none');
                    $(successIndicator).css('display', 'inline');
                    $(failIndicator).css('visibility', 'hidden');
                    this.defaults.password.ready = false;
                }

                if ((targetClass === 'reg-rpassword') && target.value) {
                      if (target.value === $('.reg-password')[0].value) {
                        $(successIndicator).css('visibility', 'visible');
                        $(successIndicator).css('display', 'inline');
                        $(failIndicator).css('display', 'none');
                        this.defaults.rpassword.ready = true;
                        this.defaults.rpassword.value = target.value;
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
                    this.defaults.rpassword.ready = false;
                }
            },
            closeModal: function() {
                this.close();
                MB.body.ensureEl();
                MB.body.$el.removeClass('modal-show');
                window.history.back();
            },

            userTypeHandler: function(e) {
                this.defaults.user_type.ready = true;
                this.defaults.user_type.value = $(e.currentTarget).data('usertype');
                $('div.user-type').removeClass('selected');
                $(e.currentTarget).addClass('selected');

            },
            genderTypeHandler: function(e) {
                this.defaults.gender.ready = true;
                this.defaults.gender.value = $(e.currentTarget).data('gendertype');
                console.log(this.defaults.gender);
                $('div.gender-type').removeClass('selected');
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

                xmlhttp.open("GET","http://api.hostip.info/get_html.php", false);
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