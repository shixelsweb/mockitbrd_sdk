define( ['MB', 'backbone', 'marionette', 'jquery', 'models/Model', 'hbs!templates/welcome'],
    function(MB, Backbone, Marionette, $, Model, template) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend( {
            template: template,
            model: new Model({
                mobile: MB.mobile
            }),

            // View Event Handlers
            events: {
                'click .earl': 'showTeamMember',
                'click .fara': 'showTeamMember',
                'click .clee': 'showTeamMember'
            },

            showTeamMember: function(e) {
                var member = e.currentTarget.classList[1];
                MB.appRouter.navigate(member, { trigger: true });
            }
        });
    });