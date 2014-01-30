define(['jquery', 'hbs!templates/dashboard', 'backbone', 'marionette'],
    function ($, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          events: {
          },

          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
          }
      });
});