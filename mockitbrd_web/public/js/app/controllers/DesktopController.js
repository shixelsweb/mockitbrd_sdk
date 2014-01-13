define([ //VIEWS
    //Components
    'MB',
    'backbone',
    'marionette',
    //UI Views
    'views/WelcomeView',
    'views/DesktopHeaderView',
    'views/RegisterView',
    'views/LoginView',
    //Learn More Views
    'views/CandidateLearnMoreView',
    'views/EducationLearnMoreView',
    'views/ProfessionalLearnMoreView',
    //Pricing Views
    'views/ProfessionalPricingView',
    'views/EducationPricingView',
    //Team Member Views
    'views/EarlView',
    'views/FaraView',
    'views/CleeView'
],
function (
//IDS
    //Components
    MB,
    Backbone,
    Marionette,
    //UI Views
    WelcomeView,
    DesktopHeaderView,
    RegisterView,
    LoginView,
    //Learn More Views
    EducationLearnMoreView,
    CandidateLearnMoreView,
    ProfessionalLearnMoreView,
    //Pricing Views
    ProfessionalPricingView,
    EducationPricingView,
    //Team Member Views
    EarlView,
    FaraView,
    CleeView
){
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
        showModal: function(View, color) {
            this.showHeader();
            this.removeBGfromPage('MB-boardroom-bg');
            MB.body.ensureEl();

            if (color === 'white') {
                MB.body.$el.addClass('modal-white-show');
                MB.modalWhite.show(new View());
            } else if (color === 'black') {
                MB.body.$el.addClass('modal-black-show');
                MB.modalBlack.show(new View());
            }
        },
        hideModal: function() {
            MB.body.ensureEl();
            MB.body.$el.removeClass('modal-black-show');
            MB.body.$el.removeClass('modal-white-show');
        },
        //gets mapped to in AppRouters's appRoutes
        index:function () {
            this.hideModal();
            this.showHeader();
            this.removeBGfromPage('MB-boardroom-bg');
            MB.mainRegion.show(new WelcomeView());
        },
        earl:function () {
            this.hideModal();
            this.showModal(EarlView, 'white');
        },
        fara:function () {
            this.hideModal();
            this.showModal(FaraView, 'white');
        },
        clee:function () {
            this.hideModal();
            this.showModal(CleeView, 'white');
        },
        login:function () {
            this.hideModal();
            this.showModal(LoginView, 'black');
        },
        register:function () {
            this.hideModal();
            this.hideHeader();
            this.addBGtoPage('MB-boardroom-bg');
            this.showModal(RegisterView, 'black');
        },
        educationLearnMore: function() {
            this.hideModal();
            this.showHeader();
            this.removeBGfromPage('MB-boardroom-bg');
            MB.mainRegion.show(new EducationLearnMoreView());
        },
        candidateLearnMore:function () {
            this.hideModal();
            this.showHeader();
            this.removeBGfromPage('MB-boardroom-bg');
        },
        professionalLearnMore:function () {
            this.hideModal();
            this.showHeader();
            this.removeBGfromPage('MB-boardroom-bg');
            MB.mainRegion.show(new ProfessionalLearnMoreView());
        },
        professionalPricing: function () {

        },
        candidatePricing: function () {

        },
        enterprisePricing: function () {

        },
        educationPricing: function () {
            this.hideModal();
            this.showHeader();
            this.removeBGfromPage('MB-boardroom-bg');
            MB.mainRegion.show(new EducationPricingView());

        }
    });
});