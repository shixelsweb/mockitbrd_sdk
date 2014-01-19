define(['jquery', 'hbs!templates/interview', 'backbone', 'marionette', 'webrtc'],
    function ($, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          initialize: function() {

          },

          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);

            
          }
      });
});