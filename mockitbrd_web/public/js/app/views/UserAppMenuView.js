define(['jquery', 'models/Model', 'hbs!templates/userAppMenu', 'backbone', 'marionette'],
    function ($, Model, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          user: null,
          model: null,
          user_pic: null,

          events: {
            'click .MB-user-menu-menu': 'showAppMenu'
          },

          initialize: function() {
            this.user = MB.api.user($.parseJSON(MB.session.get('user')));
            this.user_pic = this.user.user_pic.file_path  + '/' + this.user.user_pic.file_name;

            this.model = new Model({user: this.user, user_pic: this.user_pic});
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