define(['jquery', 'hbs!templates/accountSupport', 'backbone', 'marionette'],
    function ($, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
            $('.account-menu-item[data-accountnavigate="support"]').addClass('active');
          }
      });
});