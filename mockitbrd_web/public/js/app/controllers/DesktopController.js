define([ //VIEWS
    //Components
    'MB',
    'backbone',
    'marionette',
    'webrtc',
    'socket',
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
    //Application UI
    'views/LeftAppMenuView',
    'views/TopAppMenuView',
    'views/UserAppMenuView',
    //Dashboard Views
    'views/DashboardCalendarView',
    //Interview Views
    'views/InterviewView'
],
function (
//IDS
    //Components
    MB,
    Backbone,
    Marionette,
    SimpleWebRTC,
    socket,
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
    //Application UI
    LeftAppMenuView,
    TopAppMenuView,
    UserAppMenuView,
    //Dashboard Views
    DashboardCalendarView,
    //Interview Views
    InterviewView
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
            var leftAppMenu = new LeftAppMenuView();

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
            this.hideModal();
            this.showPrivateHeader(false);
            this.showFooter();
            MB.mainRegion.show(new AccountView());
        },
        dashboard: function () {
            var dashboardCalendar = new DashboardCalendarView();

            this.launchApp();
            $('#dashboard-view').append(dashboardCalendar.render().el);
        },
        interview: function(id) {
            var interviewView = new InterviewView();

            this.launchApp();
            $('#dashboard-view').append(interviewView.render().el);
            
            var room = location.hash.split('/')[1];

            // create our webrtc connection
            var webrtc = new SimpleWebRTC({
                // the id/element dom element that will hold "our" video
                localVideoEl: 'localVideo',
                // the id/element dom element that will hold remote videos
                remoteVideosEl: 'remoteVideo',
                // immediately ask for camera access
                autoRequestMedia: true,
                debug: true,
                detectSpeakingEvents: true,
                autoAdjustMic: false
            });

            // when it's ready, join if we got a room from the URL
            webrtc.on('readyToCall', function () {
                // you can name it anything
                if (room) webrtc.joinRoom(room);
            });
            
            // Since we use this twice we put it here
            function setRoom(name) {
                $('form').remove();
                $('h1').text(name);
                $('#subTitle').text('Link to join: ' + location.href);
                $('body').addClass('active');
            }

            if (room) {
                setRoom(room);
            } else {
                $('form').submit(function () {
                    var val = $('#sessionInput').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
                    webrtc.createRoom(val, function (err, name) {
                        console.log(' create room cb', arguments);
                    
                        var newUrl = location.pathname + '?' + name;
                        if (!err) {
                            history.replaceState({foo: 'bar'}, null, newUrl);
                            setRoom(name);
                        } else {
                            console.log(err);
                        }
                    });
                    return false;          
                });
            }

            var button = $('#screenShareButton'),
                setButton = function (bool) {
                    button.text(bool ? 'share screen' : 'stop sharing');
                };

            setButton(true);

            button.click(function () {
                if (webrtc.getLocalScreen()) {
                    webrtc.stopScreenShare();
                    setButton(true);
                } else {
                    webrtc.shareScreen(function (err) {
                        if (err) {
                            setButton(true);
                        } else {
                            setButton(false);
                        }
                    });
                    
                }
            });
        }
    });
});