define(['jquery', 'models/Model', 'hbs!templates/share', 'backbone', 'marionette'],
    function ($, Model, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          user: null,
          model: null,

          initialize: function () {
            this.user = MB.api.user(MB.session.getSession('MB-session').user);
            this.model = new Model({
              user: this.user
            });

          },
          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);


            $('.left-menu-item').removeClass('active');
            $('.MB-invite').addClass('active');
          }
      });
});