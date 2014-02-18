define(['jquery', 'models/Model', 'hbs!templates/accountMedia', 'backbone', 'marionette'],
    function ($, Model, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          model: null,
          user: null,

          initialize: function() {
            this.user = MB.api.user($.parseJSON(MB.session.give('session')).user);
            for (var i = 0; i < this.user.social.links.length; i++) {
              this.user.social[this.user.social.links[i].type] = this.user.social.links[i];
            }

            this.model = new Model({user: this.user});
            console.log(this.user);
          },
          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
            $('.account-menu-item[data-accountnavigate="social"]').addClass('active');
          }
      });
});