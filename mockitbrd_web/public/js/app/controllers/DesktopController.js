define(['MB', 'backbone', 'marionette', 'views/WelcomeView', 'views/DesktopHeaderView'],
    function (MB, Backbone, Marionette, WelcomeView, DesktopHeaderView) {
    return Backbone.Marionette.Controller.extend({
        initialize:function (options) {
            MB.headerRegion.show(new DesktopHeaderView());
        },
        //gets mapped to in MBRouter's appRoutes
        index:function () {
            MB.mainRegion.show(new WelcomeView());
        }
    });
});