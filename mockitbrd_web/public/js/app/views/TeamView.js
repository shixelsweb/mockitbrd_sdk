define(['jquery', 'hbs!templates/team', 'backbone', 'marionette'],
    function ($, template, Backbone) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend({
            template:template,

            events: {
				'click .earl': 'showTeamMember',
                'click .fara': 'showTeamMember',
                'click .clee': 'showTeamMember'
            },

            onRender: function () {
              // get rid of that pesky wrapping-div
              // assumes 1 child element.
              this.$el = this.$el.children();
              this.setElement(this.$el);
            },

            showTeamMember: function(e) {
                var member = e.currentTarget.classList[1];
                var url = "#team/" + member;
                MB.appRouter.navigate(url, { trigger: true });
            }
        });
    });