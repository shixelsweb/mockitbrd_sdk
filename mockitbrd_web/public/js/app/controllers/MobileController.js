define(['MB', 'backbone', 'marionette', 'views/WelcomeView', 'views/MobileHeaderView'],
    function (MB, Backbone, Marionette, WelcomeView, MobileHeaderView) {
    return Backbone.Marionette.Controller.extend({
        initialize:function (options) {
            MB.headerRegion.show(new MobileHeaderView());
        },
        //gets mapped to in AppRouter's appRoutes
        index:function () {
            MB.mainRegion.show(new WelcomeView());
        },
        register:function () {
            MB.mainRegion.show(new RegisterView());
        }
    });
});