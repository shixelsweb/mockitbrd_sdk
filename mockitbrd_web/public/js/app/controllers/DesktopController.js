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
    'views/NotfoundView',
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
    'views/ExploreView',
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
    NotfoundView,
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
    ExploreView,
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
        launchApp: function(view, region, regionView, viewOptions, blank) {
            var isLoggedIn = MB.session.give('session');

            if (!isLoggedIn) {
                MB.appRouter.navigate('login', {trigger: true});
                $('.MB-login-error').html('You must be logged in to view that page!');
            } else {
                var topAppMenu = new TopAppMenuView();
                var userAppMenu = new UserAppMenuView();
                var dashboard = new DashboardView();
                var leftAppMenu = new LeftAppMenuView();
                var theView = null;
                
                this.hideModal();
                this.removeView();

                //Show all components of dashboard

                if (!blank) {//renders blank dash page
                    MB.leftAppNavRegion.show(leftAppMenu);
                }
                
                MB.dashboardRegion.show(dashboard);
                MB.dashboardRegion.$el.prepend(topAppMenu.render().el);
                if (!blank) {
                    topAppMenu.$el.prepend(userAppMenu.render().el);
                }
                
                
                MB.dashboard.ensureEl();
                MB.mainRegion.$el.html(MB.dashboard.$el);
                MB.dashboard.$el.show();

                if (viewOptions) {
                    theView = new view(viewOptions);
                } else {
                    theView = new view();
                }

                $('#dashboard-view').append(theView.render().el);

                if (region) {
                    var theRegionView = new regionView();
                    $(region).html(theRegionView.render().el);
                }

            }

            
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
        prep: function(value, view) {
            this.hideModal();
            this.showPublicHeader(value);
            this.showFooter();
            MB.mainRegion.show(new view());
        },
        prepModal: function(view, option) {
            this.hideModal();
            this.showModal(view, option);
        },
        //gets mapped to in AppRouters's appRoutes
        index: function () {
            this.prep(true, WelcomeView);
        },
        earl: function () {
            this.prepModal(EarlView, 'white');
        },
        fara: function () {
            this.prepModal(FaraView, 'white');
        },
        clee: function () {
            this.prepModal(CleeView, 'white');
        },
        login: function () {
            this.prepModal(LoginView, 'office_bg.jpg');
        },
        register: function () {
            this.prepModal(RegisterView, 'office_bg.jpg');
        },
        services: function() {
            this.prep(false, ServicesView);
        },
        contact: function () {
            this.prepModal(ContactView, 'mail_bg_grid.jpg');
        },
        team: function () {
            this.prep(false, TeamView);
        },
        educationLearnMore: function() {
            this.prep(false, EducationLearnMoreView);
        },
        candidateLearnMore: function () {
            this.prep(false);
        },
        professionalLearnMore: function () {
            this.prep(false, ProfessionalLearnMoreView);
        },
        professionalPricing: function () {
            this.prep(false);
        },
        candidatePricing: function () {
            this.prep(false);
        },
        enterprisePricing: function () {
            this.prep(false);
        },
        educationPricing: function () {
            this.prep(false, EducationPricingView);
        },
        account: function () {
            this.launchApp(AccountView, "#accountViewRegion", AccountGeneralView);
        },
        accountSecurity: function () {
            this.launchApp(AccountView, "#accountViewRegion", AccountSecurityView);
        },
        accountSocial: function () {
            this.launchApp(AccountView, "#accountViewRegion", AccountMediaView);
        },
        accountBilling: function () {
            this.launchApp(AccountView, "#accountViewRegion", AccountPaymentView);
        },
        accountSupport: function () {
            this.launchApp(AccountView, "#accountViewRegion", AccountSupportView);
        },
        accountNotifications: function () {
            this.launchApp(AccountView, "#accountViewRegion", AccountNotificationsView);
        },
        dashboard: function () {
            this.launchApp(DashboardMainView);
        },
        interview: function(id) {
            this.launchApp(InterviewView, null, null, {'interview_id': id});
        },
        tasks: function() {
            this.launchApp(TaskView);
        },
        share: function() {
            var shareView = new ShareView();

            this.launchApp();

            $('#dashboard-view').append(shareView.render().el);
        },
        user: function(id) {
            var getUser = MB.api.user(id);
            this.launchApp(UserView, null, null, {'user': getUser});
        },
        explore: function() {
            this.launchApp(ExploreView);
        },
        notFound: function() {
             this.launchApp(DashboardMainView, null, null, null, true);
        }
    });
});