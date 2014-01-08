define(['MB', 'backbone', 'marionette', 'views/WelcomeView', 'views/DesktopHeaderView', 'views/RegisterView', 'views/LoginView', 'views/CandidateLearnMoreView', 'views/ProfessionalLearnMoreView', 'views/EarlView', 'views/FaraView', 'views/CleeView'],
    function (MB, Backbone, Marionette, WelcomeView, DesktopHeaderView, RegisterView, LoginView, CandidateLearnMoreView, ProfessionalLearnMoreView, EarlView, FaraView, CleeView) {
    return Backbone.Marionette.Controller.extend({
        initialize:function (options) {
            MB.headerRegion.show(new DesktopHeaderView());
        },
        //Helper functions
        showHeader: function() {
            MB.headerRegion.show(new DesktopHeaderView());
            MB.headerRegion.ensureEl();
            MB.headerRegion.$el.show();
        },
        hideHeader: function() {
            MB.headerRegion.ensureEl();
            MB.headerRegion.$el.hide();
        },
        addBGtoPage: function(bg) {
            MB.page.ensureEl();
            MB.page.$el.addClass(bg);
        },
        removeBGfromPage: function(bg) {
            MB.page.ensureEl();
            MB.page.$el.removeClass(bg);
        },
        showModal: function(View) {
            this.showHeader();
            this.removeBGfromPage('MB-boardroom-bg');
            MB.body.ensureEl();
            MB.body.$el.addClass('modal-show');
            MB.modal.show(new View());
        },
        //gets mapped to in AppRouters's appRoutes
        index:function () {
            this.showHeader();
            this.removeBGfromPage('MB-boardroom-bg');
            MB.mainRegion.show(new WelcomeView());
        },
        earl:function () {
            this.showModal(EarlView);
        },
        fara:function () {
            this.showModal(FaraView);
        },
        clee:function () {
           this.showModal(CleeView);
        },
        login:function () {
            this.showModal(LoginView);
        },
        register:function () {
            this.hideHeader();
            this.addBGtoPage('MB-boardroom-bg');
            MB.mainRegion.show(new RegisterView());
        },
        candidateLearnMore:function () {
            this.showHeader();
            this.removeBGfromPage('MB-boardroom-bg');
        },
        professionalLearnMore:function () {
            this.showHeader();
            this.removeBGfromPage('MB-boardroom-bg');
            MB.mainRegion.show(new ProfessionalLearnMoreView());
        }
    });
});