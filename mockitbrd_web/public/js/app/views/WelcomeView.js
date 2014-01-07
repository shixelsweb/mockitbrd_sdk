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
            }
        });
    });