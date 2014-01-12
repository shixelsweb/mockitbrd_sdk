define( ['MB', 'backbone', 'marionette', 'jquery', 'models/Model', 'hbs!templates/educationpricing'],
function(MB, Backbone, Marionette, $, Model, template) {
    //ItemView provides some default rendering logic
    return Backbone.Marionette.ItemView.extend( {
        template: template,
        // View Event Handlers
        events: {
        }
    });
});