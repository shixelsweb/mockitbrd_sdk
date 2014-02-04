define([
    'jquery',
    'models/Model', 
    'hbs!templates/leftAppMenu', 
    'backbone', 
    'marionette'
    ],
    function (
      $, 
      Model, 
      template, 
      Backbone
      ){
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          user: null,

          events: {
            'click .left-menu-item': 'onLeftMenuClick',
            'click .MB-left-app-menu-button': 'onLeftAppMenuButtonClick'
          },
          
          initialize: function(options) {
            this.user = MB.api.user($.parseJSON(MB.session.give('session')).user);

            this.model = new Model({user: this.user});
          },
          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
          },
          onLeftMenuClick: function(e) {
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