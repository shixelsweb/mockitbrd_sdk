define(['jquery', 'cookie', 'backbone', 'marionette', 'underscore', 'handlebars', 'models/Model'],
    function ($, cookie, Backbone, Marionette, _, Handlebars, Model) {
        var MB = window.MB = new Backbone.Marionette.Application();

        function isMobile() {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return ((/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(userAgent));
        }

        MB.modalRegion = Backbone.Marionette.Region.extend({
            el: "#MB-modal .modal",

            events: {
                "click .MB-modal-close": "hideModal"
            },

            constructor: function() {
                _.bindAll(this);
                Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
                this.on('view:show', this.showModal, this);
            },

            getEl: function(selector){
                var $el = $(selector);

                $el.on('hidden', this.close);

                return $el;
            },

            showModal: function(view) {
                view.on('close', this.hideModal, this);
                this.$el_region.modal('show');
            },

            hideModal: function(){
                console.log("hide");
                this.$el_region.modal('hide');
            }
        });

        //Organize Application into regions corresponding to DOM elements
        //Regions can contain views, Layouts, or subregions nested as necessary
        MB.addRegions({
            page: "#page",
            headerRegion:"header",
            mainRegion:"#main",
            hero: ".hero-unit",
            modal: MB.modalRegion,
            body: "body"
        });

        MB.addInitializer(function () {
            Backbone.history.start({pushState: true});
        });

        $(document).delegate("a", "click", function(evt) {
          // Get the anchor href and protcol
          var href = $(this).attr("href");
          var protocol = this.protocol + "//";
          // Ensure the protocol is not part of URL, meaning its relative.
          // Stop the event bubbling to ensure the link will not cause a page refresh.
          if (href.slice(protocol.length) !== protocol && href.substring(0, 1) !== '#') {
            evt.preventDefault();
            // Note by using Backbone.history.navigate, router events will not be
            // triggered.  If this is a problem, change this to navigate on your
            // router.
            MB.appRouter.navigate(href, { trigger: true });
          }
        });

        MB.session = {
            user: $.cookie('MB-session-user') || null,
            token: $.cookie('MB-session-auth-token') || null,

            generateToken: function () {
                var MAX = 9e15;
                var MIN = 1e15;
                var safegap = 1000;
                var counter = MIN;

                var increment = Math.floor(safegap*Math.random());
                if(counter > (MAX - increment)) {
                    counter = MIN;
                }
                counter += increment;
                return counter.toString(36);
            },

            start: function(user) {
                var auth_token = MB.session.generateToken();
                var session_user = user;
                //TODO: Remove password from user object
                if (!MB.session.user && !MB.session.token) { //only create a session if one doesn't already exsist
                    $.cookie('MB-session-auth-token', auth_token);
                    $.cookie('MB-session-user', JSON.stringify(user));
                }
            }
        };

        MB.mobile = isMobile();

        MB.api = {
            url: "http://api.mockitbrd.com/",
            //TODO: remember email, stay logged in (increase session time), only login if status is active
            login: function(params) {
                $.ajax({
                    type: "POST",
                    url: MB.api.url + "v1/user/verify_user",
                    data: params,
                    dataType: 'json',
                    success: function (response) {
                        if (response.success === 0) {
                            alert("error: ", response.data.error); //TODO: add to Error Modal
                        } else {
                          MB.session.start(response.data.user);
                          //TODO FIGURE OUT DUPLILCATE SESSIONS AND CLOSE ON SUCCESS
                        }
                    },
                    error: function(response) {
                        alert("error! ", response); //TODO: add to Error Modal
                    }
                });
            }
        };

        return MB;
    });