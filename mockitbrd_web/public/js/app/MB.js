define([
    'jquery',
    'backbone',
    'marionette',
    'underscore',
    'handlebars',
    'models/MBSession',
    'models/MBapi',
    'models/MBModalBlack',
    'models/MBModalWhite',
    'models/MBModalBg',
    'models/MBEmail',
    'models/MBHelper'
    ],
    function (
    $,
    Backbone,
    Marionette,
    _,
    Handlebars,
    MBSession,
    MBapi,
    MBModalBlack,
    MBModalWhite,
    MBModalBg,
    MBEmail,
    MBHelper
){
    var MB = window.MB = new Backbone.Marionette.Application();

    MB.env = 'test';

    function isMobile() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return ((/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(userAgent));
    }

    MB.modalWhite = MBModalWhite;
    MB.modalBlack = MBModalBlack;
    MB.modalBg = MBModalBg;
    MB.helper = new MBHelper();
    MB.email = new MBEmail();
    MB.session = new MBSession();
    MB.api = new MBapi();
    MB.mobile = isMobile();
    //Organize Application into regions corresponding to DOM elements
    //Regions can contain views, Layouts, or subregions nested as necessary
    MB.addRegions({
        page: "#page",
        headerRegion:"header",
        footerRegion: "footer",
        leftAppNavRegion: "#left-header",
        dashboardRegion: "#dashboard-content",
        mainRegion:"#main",
        dashboard: "#dashboard",
        appTopNavRegion: "#app-header",
        hero: ".hero-unit",
        userTopNavRegion: "#MB-app-user-menu",
        modalWhite: MB.modalWhite,
        modalBlack: MB.modalBlack,
        modalBg: MB.modalBg,
        confirmRegion: "#MB-confirm .modal",
        body: "body",
        topMenuRegion: "#top-app-menu-view",
        notMenuRegion: "#not-menu",
        createTaskRegion: '#MB-create-task-view'
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