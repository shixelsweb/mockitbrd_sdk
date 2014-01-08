define(['MB', 'backbone', 'marionette', 'views/WelcomeView', 'views/DesktopHeaderView', 'views/RegisterView', 'views/LoginView', 'views/CandidateLearnMoreView', 'views/ProfessionalLearnMoreView'],
    function (MB, Backbone, Marionette, WelcomeView, DesktopHeaderView, RegisterView, LoginView, CandidateLearnMoreView, ProfessionalLearnMoreView) {
    return Backbone.Marionette.Controller.extend({
        initialize:function (options) {
            MB.headerRegion.show(new DesktopHeaderView());
        },
        //gets mapped to in AppRouters's appRoutes
        index:function () {
            MB.headerRegion.show(new DesktopHeaderView());
            MB.headerRegion.ensureEl();
            MB.headerRegion.$el.show();
            MB.page.ensureEl();
            MB.page.$el.removeClass('MB-boardroom-bg');
            MB.mainRegion.show(new WelcomeView());
        },
        login:function () {
            MB.headerRegion.ensureEl();
            MB.headerRegion.$el.hide();
            MB.page.ensureEl();
            MB.page.$el.removeClass('MB-boardroom-bg');
            MB.mainRegion.show(new LoginView());
        },
        register:function () {
            MB.headerRegion.ensureEl();
            MB.headerRegion.$el.hide();
            MB.page.ensureEl();
            MB.page.$el.addClass('MB-boardroom-bg');
            MB.mainRegion.show(new RegisterView());
        },
        candidateLearnMore:function () {
            MB.headerRegion.show(new DesktopHeaderView());
            MB.headerRegion.ensureEl();
            MB.headerRegion.$el.show();
            MB.page.ensureEl();
            MB.page.$el.removeClass('MB-boardroom-bg');
        },
        professionalLearnMore:function () {
            MB.headerRegion.show(new DesktopHeaderView());
            MB.headerRegion.ensureEl();
            MB.headerRegion.$el.show();
            MB.page.ensureEl();
            MB.page.$el.removeClass('MB-boardroom-bg');
            MB.mainRegion.show(new ProfessionalLearnMoreView());
        }
    });
});