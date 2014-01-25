define(['jquery', 'models/Model', 'hbs!templates/accountGeneral', 'backbone', 'marionette'],
    function ($, Model, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          user: null,
          model: null,

          initialize: function() {
            this.user = MB.api.user($.parseJSON(MB.session.get('user'))) || null;
            this.model = new Model({
              user: this.user
            });
          },
          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
          }
      });
});