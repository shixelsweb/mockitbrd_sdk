define(['jquery', 'models/Model', 'hbs!templates/accountGeneral', 'backbone', 'marionette'],
    function ($, Model, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          user: null,
          model: null,

          initialize: function() {
            this.user = MB.api.user($.parseJSON(MB.session.give('session')).user) || null;

            this.user.profileURL = window.location.origin + '/' + 'user/' + this.user._id;
            this.model = new Model({
              user: this.user
            });            
          },
          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
            $('.account-menu-item[data-accountnavigate="general"]').addClass('active');
          }
      });
});