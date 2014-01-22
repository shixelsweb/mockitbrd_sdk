define(['jquery', 'hbs!templates/leftAppMenu', 'backbone', 'marionette'],
    function ($, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          events: {
            'click .left-menu-item': 'onLeftMenuClick',
            'click .MB-left-app-menu-button': 'onLeftAppMenuButtonClick'
          },

          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
          },
          onLeftMenuClick: function(e) {
            e.preventDefault();

            $('.left-menu-item').removeClass('active');
            $(e.currentTarget).addClass('active');
          },

          onLeftAppMenuButtonClick: function(e) {
            e.preventDefault();

            if ($('.MB-left-app-menu').css('left') === '0px') {
              $('.MB-left-app-menu').css('left', '-180px');
              $('.MB-left-app-menu-button').css('left', '0px');
            } else {
              $('.MB-left-app-menu').css('left', '0px');
              $('.MB-left-app-menu-button').css('left', '180px');
            }
          }
      });
});