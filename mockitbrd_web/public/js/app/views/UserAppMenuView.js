define(['jquery','views/MBConfirm', 'models/Model', 'hbs!templates/userAppMenu', 'backbone', 'marionette'],
    function ($, MBConfirm, Model, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          user: null,
          model: null,

          events: {
            'click .MB-user-menu-menu': 'logout'
          },

          initialize: function() {
            console.log(this);
            this.user = MB.api.user($.parseJSON(MB.session.give('session')).user);            
            this.model = new Model({user: this.user, user_pic: this.user_pic});
          },

          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
          },

          logout: function(e) {
            MB.body.ensureEl();
            MB.body.$el.addClass('modal-black-show');
            var lougoutApp = new Backbone.Wreqr.Commands();

            lougoutApp.addHandler('yes', function(){
              MB.api.logout();
              MB.appRouter.navigate('dashboard', {trigger: true});
            });
            MB.confirmRegion.show( new MBConfirm({commands: lougoutApp, 'title': 'You are about to logout', 'body': 'Are you sure you want to logout?'}));
          }
      });
});