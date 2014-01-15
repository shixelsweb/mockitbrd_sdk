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
    'views/ContactView',
    'views/TeamView',
    'views/ServicesView',
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
    ContactView,
    TeamView,
    ServicesView,
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
        initialize: function (options) {
            this.showPublicHeader(true);
        },
        //Helper functions
        showPublicHeader: function(isGhost) { //shows the non logged in versino of the nav bar and passes in a boolean that says whether or not the nav background is transparant
            MB.headerRegion.show(new DesktopHeaderView());
            MB.headerRegion.ensureEl();

            if (isGhost === true) {
                MB.headerRegion.$el.addClass('ghost');
            } else {
                MB.headerRegion.$el.removeClass('ghost');
            }
            MB.headerRegion.$el.show();
        },
        showPrivateHeader: function(isBusiness) { //shows the non logged in versino of the nav bar and passes in a boolean that says whether or not the nav background is transparant
            MB.headerRegion.show(new DesktopHeaderView());
            MB.headerRegion.ensureEl();

            if (isGhost === true) {
                MB.headerRegion.$el.addClass('ghost');
            } else {
                MB.headerRegion.$el.removeClass('ghost');
            }
            MB.headerRegion.$el.show();
        },
        hideHeader: function() { //hides the nav (for modals and error/success messages)
            MB.headerRegion.ensureEl();
            MB.headerRegion.$el.hide();
        },
        showModal: function(View, color) { //shows a modal and passes in the view to show in modal and the color or the modal bg
            MB.body.ensureEl();

            if (color === 'white') {
                MB.body.$el.addClass('modal-white-show');
                MB.modalWhite.show(new View());
            } else if (color === 'black') {
                MB.body.$el.addClass('modal-black-show');
                MB.modalBlack.show(new View());
            }
        },
        hideModal: function() { //hides the modal
            MB.body.ensureEl();
            MB.body.$el.removeClass('modal-black-show');
            MB.body.$el.removeClass('modal-white-show');
        },
        //gets mapped to in AppRouters's appRoutes
        index: function () {
            this.hideModal();
            this.showPublicHeader(true);
            MB.mainRegion.show(new WelcomeView());
        },
        earl: function () {
            this.hideModal();
            this.showModal(EarlView, 'white');
        },
        fara: function () {
            this.hideModal();
            this.showModal(FaraView, 'white');
        },
        clee: function () {
            this.hideModal();
            this.showModal(CleeView, 'white');
        },
        login: function () {
            this.hideModal();
            this.showModal(LoginView, 'black');
        },
        register: function () {
            this.hideModal();
            this.showModal(RegisterView, 'black');
        },
        services: function() {
            this.hideModal();
            this.showPublicHeader(false);
            MB.mainRegion.show(new ServicesView());
        },
        contact: function () {
            this.hideModal();
            this.showModal(ContactView, 'white');
        },
        team: function () {
            this.hideModal();
            this.showPublicHeader(false);
            MB.mainRegion.show(new TeamView());
        },
        educationLearnMore: function() {
            this.hideModal();
            this.showPublicHeader(false);
            MB.mainRegion.show(new EducationLearnMoreView());
        },
        candidateLearnMore: function () {
            this.hideModal();
            this.showPublicHeader(false);
        },
        professionalLearnMore: function () {
            this.hideModal();
            this.showPublicHeader(false);
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
            this.showPublicHeader(false);
            MB.mainRegion.show(new EducationPricingView());

        }
    });
});