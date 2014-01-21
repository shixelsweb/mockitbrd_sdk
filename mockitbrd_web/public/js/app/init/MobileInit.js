// Include Desktop Specific JavaScript files here (or inside of your Desktop Controller, or differentiate based off App.mobile === false)
require(["MB", "jquery", "routers/AppRouter", "controllers/DesktopController", "backbone", "marionette", "jquerymobile", "backbone.validateAll"],
    function (MB, $, AppRouter, AppController) {
        // Prevents all anchor click handling
        $.mobile.linkBindingEnabled = false;
        // Disabling this will prevent jQuery Mobile from handling hash changes
        $.mobile.hashListeningEnabled = false;

        MB.appRouter = new AppRouter({
            controller:new AppController()
        });

        MB.start();
    });