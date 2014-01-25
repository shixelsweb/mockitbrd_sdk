define([ //VIEWS
    //Components
    'MB',
    'backbone',
    'marionette',
    'webrtc',
    //UI Views
    'views/WelcomeView',
    'views/DesktopHeaderView',
    'views/DesktopFooterView',
    'views/RegisterView',
    'views/LoginView',
    'views/ContactView',
    'views/TeamView',
    'views/ServicesView',
    'views/MBConfirm',
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
    'views/CleeView',
    //Application Views
    'views/DashboardView',
    'views/AccountView',
    'views/TaskView',
    'views/UserView',
    //Application UI
    'views/LeftAppMenuView',
    'views/TopAppMenuView',
    'views/UserAppMenuView',
    //Dashboard Views
    'views/DashboardMainView',
    //Interview Views
    'views/InterviewView',
    //Account Views
    'views/AccountNotificationsView',
    'views/AccountPaymentView',
    'views/AccountSupportView',
    'views/AccountGeneralView',
    'views/AccountSecurityView',
    'views/AccountMediaView'
],
function (
//IDS
    //Components
    MB,
    Backbone,
    Marionette,
    SimpleWebRTC,
    //UI Views
    WelcomeView,
    DesktopHeaderView,
    DesktopFooterView,
    RegisterView,
    LoginView,
    ContactView,
    TeamView,
    ServicesView,
    MBConfirm,
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
    CleeView,
    //Application Views
    DashboardView,
    AccountView,
    TaskView,
    UserView,
    //Application UI
    LeftAppMenuView,
    TopAppMenuView,
    UserAppMenuView,
    //Dashboard Views
    DashboardMainView,
    //Interview Views
    InterviewView,
    //Account Views
    AccountNotificationsView,
    AccountPaymentView,
    AccountSupportView,
    AccountGeneralView,
    AccountSecurityView,
    AccountMediaView
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
        showFooter: function() {
            MB.footerRegion.show(new DesktopFooterView());
        },
        showPrivateHeader: function(isGhost) { //shows the non logged in versino of the nav bar and passes in a boolean that says whether or not the nav background is transparant
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
        launchApp: function() {
            var topAppMenu = new TopAppMenuView();
            var userAppMenu = new UserAppMenuView();
            var dashboard = new DashboardView();
            var paymentView = new AccountPaymentView();
            var securityView = new AccountSecurityView();
            var notificationView = new AccountNotificationsView();
            var supportView = new AccountSupportView();
            var generalView = new AccountGeneralView();
            var mediaView = new AccountMediaView();
            var leftAppMenu = new LeftAppMenuView({'mediaView': mediaView, 'securityView': securityView, 'paymentView': paymentView, 'notificationView': notificationView, 'supportView': supportView, 'generalView': generalView});

            this.hideModal();
            //this.showFooter();
            this.hideHeader();
            MB.leftAppNavRegion.show(leftAppMenu);
            MB.dashboardRegion.show(dashboard);
            MB.dashboardRegion.$el.prepend(topAppMenu.render().el);
            topAppMenu.$el.prepend(userAppMenu.render().el);
            MB.dashboard.ensureEl();
            MB.dashboard.$el.show();
        },
        showModal: function(View, color) { //shows a modal and passes in the view to show in modal and the color or the modal bg
            MB.body.ensureEl();
            var url = "../../img/" + color;

            if (color === 'white') {
                MB.body.$el.addClass('modal-white-show');
                MB.modalWhite.show(new View());
            } else if (color === 'black') {
                MB.body.$el.addClass('modal-black-show');
                MB.modalBlack.show(new View());
            } else {
                MB.body.$el.addClass('modal-bg-show');
                $('#MB-modal-bg').css('background-image', 'url(' + url + ')');
                $('#MB-modal-bg').css('background-postion', 'center');
                $('#MB-modal-bg').css('background-size', 'cover');
                MB.modalBg.show(new View());
            }
        },
        hideModal: function() { //hides the modal
            MB.body.ensureEl();
            MB.body.$el.removeClass('modal-black-show');
            MB.body.$el.removeClass('modal-white-show');
            MB.body.$el.removeClass('modal-bg-show');
        },
        //gets mapped to in AppRouters's appRoutes
        index: function () {
            this.hideModal();
            this.showPublicHeader(true);
            this.showFooter();
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
            var isLoggedIn = MB.session.get('token');
            this.hideModal();
            if (isLoggedIn) {
                MB.appRouter.navigate('dashboard', {trigger: true});
            } else {
                this.showModal(LoginView, 'office_bg.jpg');
            }
        },
        register: function () {
            this.hideModal();
            this.showModal(RegisterView, 'office_bg.jpg');
        },
        services: function() {
            this.hideModal();
            this.showPublicHeader(false);
            this.showFooter();
            MB.mainRegion.show(new ServicesView());
        },
        contact: function () {
            this.hideModal();
            this.showModal(ContactView, 'mail_bg_grid.jpg');
        },
        team: function () {
            this.hideModal();
            this.showPublicHeader(false);
            this.showFooter();
            MB.mainRegion.show(new TeamView());
        },
        educationLearnMore: function() {
            this.hideModal();
            this.showPublicHeader(false);
            this.showFooter();
            MB.mainRegion.show(new EducationLearnMoreView());
        },
        candidateLearnMore: function () {
            this.hideModal();
            this.showPublicHeader(false);
            this.showFooter();
        },
        professionalLearnMore: function () {
            this.hideModal();
            this.showPublicHeader(false);
            this.showFooter();
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
            this.showFooter();
            MB.mainRegion.show(new EducationPricingView());

        },
        account: function () {
            var accountView = new AccountView();
            var generalView = new AccountGeneralView();

            this.launchApp();
            
            $('#dashboard-view').append(accountView.render().el);
            $("#accountViewRegion").html(generalView.render().el);
        },
        dashboard: function () {
            var dashboardMainView = new DashboardMainView();

            this.launchApp();
            $('#dashboard-view').append(dashboardMainView.render().el);
        },
        interview: function(id) {
            var interviewView = new InterviewView({'interview_id': id, 'webrtc': SimpleWebRTC, 'confirm': MBConfirm});

            this.launchApp();

            $('#dashboard-view').append(interviewView.render().el);
        },
        tasks: function() {
            var taskView = new TaskView();

            this.launchApp();

            $('#dashboard-view').append(taskView.render().el);
        },
        user: function(id) {
            var getUser = MB.api.user(id);
            var userView = new UserView({'user': getUser});

            this.launchApp();

            $('#dashboard-view').append(userView.render().el);
        }
    });
});