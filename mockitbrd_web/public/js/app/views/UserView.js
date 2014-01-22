define(['jquery', 'models/Model', 'hbs!templates/user', 'backbone', 'marionette'],
    function ($, Model, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          model: null,
          user: null,
          currentUser: null,
          isOwner: null,

          initialize:function(options) {

            this.user = options.user;
            this.currentUser = $.parseJSON(MB.session.get('user'));
            if(this.user._id === this.currentUser._id) {
              this.isOwner = true;
            } else {
              this.isOwner = false;
            }
            this.model = new Model ({user: this.user, isOwner: this.isOwner});
          },
          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
            $('.left-menu-item').removeClass('active');

            if (this.isOwner) {
              $('.MB-profile').addClass('active');
            } else {
               $('.MB-connections').addClass('active');
            }
          }
    });
});