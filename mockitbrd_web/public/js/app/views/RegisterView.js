define(['jquery', 'hbs!templates/register', 'backbone', 'marionette'],
    function ($, template, Backbone) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend({
            template:template,

            onRender: function() {
            }
        });
    });