define(['jquery', 'backbone', 'marionette', 'underscore', 'handlebars'],
    function ($, Backbone, Marionette, _, Handlebars) {
        var MB = window.MB = new Backbone.Marionette.Application();

        function isMobile() {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return ((/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(userAgent));
        }

        //Organize Application into regions corresponding to DOM elements
        //Regions can contain views, Layouts, or subregions nested as necessary
        MB.addRegions({
            page: "#page",
            headerRegion:"header",
            mainRegion:"#main",
            hero: ".hero-unit"
        });

        MB.addInitializer(function () {
            Backbone.history.start();
        });

        MB.mobile = isMobile();

        MB.api = 'api.mockitbrd.com/';

        return MB;
    });