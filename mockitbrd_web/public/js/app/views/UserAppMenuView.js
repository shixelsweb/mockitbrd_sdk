define(['jquery', 'hbs!templates/userAppMenu', 'backbone', 'marionette'],
    function ($, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          events: {
            'click .MB-user-menu-menu': 'showAppMenu'
          },

          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
          },

          showAppMenu: function(e) {

            if ($('.MB-user-menu-open').css('top') === '60px') {
              $('.MB-user-menu-open').css('top', '-180px');
            } else {
              $('.MB-user-menu-open').css('top', '60px');
            }
          }
      });
});