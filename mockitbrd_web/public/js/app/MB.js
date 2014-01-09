define(['jquery', 'backbone', 'marionette', 'underscore', 'handlebars'],
    function ($, Backbone, Marionette, _, Handlebars) {
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
        MB.mobile = isMobile();

        MB.api = {
            url: "http://api.mockitbrd.com/v1/",

            login: function(params) {
                console.log("here2", params);
                $.ajax({
                    type: "POST",
                    url: MB.api.url + "user/verify_user",
                    data: params,
                    dataType: "json",
                    crossDomain: true,
                    success: function (response) {
                        console.log("logged in!", response);
                    }
                });
            }
        };

        return MB;
    });