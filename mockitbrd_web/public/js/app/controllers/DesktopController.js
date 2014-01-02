define(['MB', 'backbone', 'marionette', 'views/WelcomeView', 'views/DesktopHeaderView', 'views/RegisterView', 'views/LoginView'],
    function (MB, Backbone, Marionette, WelcomeView, DesktopHeaderView, RegisterView, LoginView) {
    return Backbone.Marionette.Controller.extend({
        initialize:function (options) {
            MB.headerRegion.show(new DesktopHeaderView());
        },
        //gets mapped to in AppRouters's appRoutes
        index:function () {
            MB.mainRegion.show(new WelcomeView());
        },
        login:function () {
            MB.mainRegion.show(new LoginView());
        },
        register:function () {
            MB.mainRegion.show(new RegisterView());
        }
    });
});