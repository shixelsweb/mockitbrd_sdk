define(['jquery', 'hbs!templates/account', 'backbone', 'marionette'],
    function ($, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          user: null,

          initialize: function() {
            this.user = $.parseJSON(MB.session.get('user')) || null;
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