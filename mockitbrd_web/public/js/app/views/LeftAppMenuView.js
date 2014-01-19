define(['jquery', 'hbs!templates/leftAppMenu', 'backbone', 'marionette'],
    function ($, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          events: {
            'hover li': 'onLeftMenuHover',
            'click .left-menu-item': 'onLeftMenuClick',
            'click .MB-left-app-menu-button': 'onLeftAppMenuButtonClick'
          },

          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
          },

          onLeftMenuHover: function(e) {
            e.preventDefault();

            var currentButton = e.currentTarget;
            var string = $(e.currentTarget).data('menuitem');
            var title = string.charAt(0).toUpperCase() + string.slice(1);

            if(string !== 'home') {
              $(e.currentTarget).tooltip({'title': title, 'placement': 'right', 'trigger': 'hover'});
            }
          },

          onLeftMenuClick: function(e) {
            e.preventDefault();

            $('.left-menu-item').removeClass('active');
            $(e.currentTarget).addClass('active');
          },

          onLeftAppMenuButtonClick: function(e) {
            e.preventDefault();

            if ($('.MB-left-app-menu').css('left') === '0px') {
              $('.MB-left-app-menu').css('left', '-60px');
              $('.MB-left-app-menu-button').css('left', '0px');
            } else {
              $('.MB-left-app-menu').css('left', '0px');
              $('.MB-left-app-menu-button').css('left', '60px');
            }
          }
      });
});