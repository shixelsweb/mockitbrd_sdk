define([ //VIEWS
    //Components
    'MB',
    'backbone',
    'marionette',
    //UI Views
    'views/WelcomeView',
    'views/DesktopHeaderView',
    'views/DesktopFooterView',
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
    'views/CleeView',
    //Application Views
    'views/DashboardView',
    'views/AccountView',
    'views/TaskView',
    'views/UserView',
    'views/ShareView',
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
    //UI Views
    WelcomeView,
    DesktopHeaderView,
    DesktopFooterView,
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
    CleeView,
    //Application Views
    DashboardView,
    AccountView,
    TaskView,
    UserView,
    ShareView,
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
        removeView: function() { //hides the nav (for modals and error/success messages)
            MB.mainRegion.ensureEl();
            if (MB.mainRegion.currentView) {
                MB.mainRegion.currentView.remove();
            }
            MB.headerRegion.ensureEl();
            if (MB.headerRegion.currentView) {
                MB.headerRegion.currentView.remove();
            }
            MB.footerRegion.ensureEl();
            if (MB.footerRegion.currentView) {
                MB.footerRegion.currentView.remove();
            }
        },
        removeHeader: function() { //hides the nav (for modals and error/success messages)
           
        },
        launchApp: function() {
            var topAppMenu = new TopAppMenuView();
            var userAppMenu = new UserAppMenuView();
            var dashboard = new DashboardView();
            var leftAppMenu = new LeftAppMenuView();
            
            this.hideModal();
            this.removeView();

            //Show all components of dashboard
            MB.leftAppNavRegion.show(leftAppMenu);
            MB.dashboardRegion.show(dashboard);
            MB.dashboardRegion.$el.prepend(topAppMenu.render().el);
            topAppMenu.$el.prepend(userAppMenu.render().el);
            MB.dashboard.ensureEl();
            MB.mainRegion.$el.html(MB.dashboard.$el);
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
            this.hideModal();
            this.showModal(LoginView, 'office_bg.jpg');
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
            var currentAccountView = new AccountGeneralView();

            this.launchApp();
            
            $('#dashboard-view').append(accountView.render().el);
            $("#accountViewRegion").html(currentAccountView.render().el);
        },
        accountSecurity: function () {
            var accountView = new AccountView();
            var currentAccountView = new AccountSecurityView();

            this.launchApp();
            
            $('#dashboard-view').append(accountView.render().el);
            $("#accountViewRegion").html(currentAccountView.render().el);
        },
        accountSocial: function () {
            var accountView = new AccountView();
            var currentAccountView = new AccountMediaView();

            this.launchApp();
            
            $('#dashboard-view').append(accountView.render().el);
            $("#accountViewRegion").html(currentAccountView.render().el);
        },
        accountBilling: function () {
            var accountView = new AccountView();
            var currentAccountView = new AccountPaymentView();

            this.launchApp();
            
            $('#dashboard-view').append(accountView.render().el);
            $("#accountViewRegion").html(currentAccountView.render().el);
        },
        accountSupport: function () {
            var accountView = new AccountView();
            var currentAccountView = new AccountSupportView();

            this.launchApp();
            
            $('#dashboard-view').append(accountView.render().el);
            $("#accountViewRegion").html(currentAccountView.render().el);
        },
        accountNotifications: function () {
            var accountView = new AccountView();
            var currentAccountView = new AccountNotificationsView();

            this.launchApp();
            
            $('#dashboard-view').append(accountView.render().el);
            $("#accountViewRegion").html(currentAccountView.render().el);
        },
        dashboard: function () {
            var dashboardMainView = new DashboardMainView();

            this.launchApp();
            $('#dashboard-view').append(dashboardMainView.render().el);
        },
        interview: function(id) {
            var interviewView = new InterviewView({'interview_id': id});

            this.launchApp();

            $('#dashboard-view').append(interviewView.render().el);
        },
        tasks: function() {
            var taskView = new TaskView();

            this.launchApp();

            $('#dashboard-view').append(taskView.render().el);
        },
        share: function() {
            var shareView = new ShareView();

            this.launchApp();

            $('#dashboard-view').append(shareView.render().el);
        },
        user: function(id) {
            var getUser = MB.api.user(id);
            var userView = new UserView({'user': getUser});

            this.launchApp();

            $('#dashboard-view').append(userView.render().el);
        }
    });
});