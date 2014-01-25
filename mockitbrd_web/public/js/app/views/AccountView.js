define(['jquery', 'models/Model', 'hbs!templates/account', 'backbone', 'marionette'],
    function ($, Model, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          model: null,

          events:{
          },
          

          initialize: function(options) {

          },

          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);

            var user = this.user;
          }

          
      });
});