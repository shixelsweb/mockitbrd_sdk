define(['jquery', 'backbone', 'marionette', 'underscore', 'handlebars', 'models/MBSession', 'models/MBapi', 'models/MBModalBlack', 'models/MBModalWhite', 'models/MBCookie'],
    function ($, Backbone, Marionette, _, Handlebars, MBSession, MBapi, MBModalBlack, MBModalWhite, MBCookie) {
        var MB = window.MB = new Backbone.Marionette.Application();

        function isMobile() {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return ((/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(userAgent));
        }

        MB.modalWhite = MBModalWhite;
        MB.modalBlack = MBModalBlack;
        MB.cookie = new MBCookie();
        MB.session = new MBSession();
        MB.api = new MBapi();
        MB.mobile = isMobile();

        //Organize Application into regions corresponding to DOM elements
        //Regions can contain views, Layouts, or subregions nested as necessary
        MB.addRegions({
            page: "#page",
            headerRegion:"header",
            mainRegion:"#main",
            hero: ".hero-unit",
            modalWhite: MB.modalWhite,
            modalBlack: MB.modalBlack,
            body: "body"
        });

        MB.addInitializer(function () {
            Backbone.history.start();
        });

        //TODO-(Fara) - make the push state work on refresh
        // $(document).delegate("a", "click", function(evt) {
        //   // Get the anchor href and protcol
        //   var href = $(this).attr("href");
        //   var protocol = this.protocol + "//";
        //   // Ensure the protocol is not part of URL, meaning its relative.
        //   // Stop the event bubbling to ensure the link will not cause a page refresh.
        //   if (href.slice(protocol.length) !== protocol && href.substring(0, 1) !== '#') {
        //     evt.preventDefault();
        //     // Note by using Backbone.history.navigate, router events will not be
        //     // triggered.  If this is a problem, change this to navigate on your
        //     // router.
        //     MB.appRouter.navigate(href, { trigger: true });
        //   }
        // });

        return MB;
    });