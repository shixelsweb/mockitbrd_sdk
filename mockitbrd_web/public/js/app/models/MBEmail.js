/*
    MBEmail
    - Sends an email to a given email address

    Use:
    First make sure "MB" is in the define function

    note: The send function is automaticcaly ran when you choose to send an email

    URL PARAMATER - MB.api.url
    SEND EMAIL - MB.email.create(EMAIL)

    ex of EMAIL = {
                        'title': TEXT,
                        'email': EMAIL_RECIPIANT e.g. 'test@test.com'
                        'message': 'MESSAGE_HTML_NAME.HTML',
                        'type': 'general' or 'activation' or 'help' or 'job' or 'forgot'
                    };

*/
define(["jquery", "underscore", "backbone"],
    function($, _, Backbone) {
        // Creates a new Backbone Model class object
        var MBEmail = Backbone.Model.extend({

            general: {email: "shout@mockitbrd.com", team: "The team at MockitBrd", subject: "Thanks for the email!"},
            jobs_email: {email: "jobs@mockitbrd.com", team: "Careers at MockitBrd", subject: "We received your application!"},
            help_email: {email: "help@mockitbrd.com", team: "Help Desk at MockitBrd", subject: "Let us Help"},
            activation_email: {email: "activate@mockitbrd.com", team: "The team at MockitBrd", subject: "Acitvate your account"},
            forgot_email: {email: "iforgot@mockitbrd.com", team: "Help at MockitBrd", subject: "We'll Help you retrieve it!"},

            initialize: function() {
                _.bindAll(this);
            },

            start: function (email_data) {
                   var email_body = this.getHTML('email.html', email_data);
            },

            create: function (email_body, email_data) {
                var title = email_data.title;
                var email = email_data.email;
                var message = email_data.message;
                var type = email_data.type;
                var company = null;
                var body_email = $(email_body);
                var subject = null;

                if (email_data.type === 'general') {company = this.general;}
                if (email_data.type === 'jobs') {company = this.jobs_email_data; }
                if (email_data.type === 'help') {company = this.help_email_data;}
                if (email_data.type === 'activatation') {company = this.activation_email;}
                if (email_data.type === 'forgot') {company = this.forgot_email;}

                var from = company.email;

                body_email.find('.salutation').html(title);
                body_email.find('.message').html(message);
                body_email.find('.team').html(company.team);
                body_email.find('.note_email').html(company.email);

                var html = '<html><body>' + body_email[1].innerHTML + '</body></html>';

                var email_send = {'to': email, 'from': from, 'subject': company.subject, 'message': html};

                this.send(email_send);
            },

            send: function(params) {
                $.ajax({
                    type: "POST",
                    url: 'http://mockitbrd.com/email_php_sender.php',
                    data: params,
                    dataType: "json",
                    success: function (response) {
                        console.log("response: ", response);
                    },
                    error: function(response) {
                        console.log("error: ", response);
                    }
                });
            },

            getHTML: function(path, email_data) {
                var self = this;
                $.ajax({
                    type: "GET",
                    url: '../../../helpers/emails/' + path,
                    success: function (response) {
                        self.create(response, email_data);
                    },
                    error: function(response) {
                    }
                });
            }
        });

        // Returns the Model class
        return  MBEmail;

    }

);