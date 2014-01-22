define(['jquery', 'models/Model', 'hbs!templates/account', 'backbone', 'marionette'],
    function ($, Model, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          model: null,
          notView: null,
          payView: null,
          supView: null,
          genView: null,

          events:{
            'click .nav-tabs li': 'handleTabClick'
          },
          

          initialize: function(options) {
            this.notView = options.notificationView;
            this.payView = options.paymentView;
            this.supView = options.supportView;
            this.genView = options.generalView;

          },

          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);

            var user = this.user;

            

          },
          handleTabClick: function(e) {
            var view = $(e.currentTarget).data('navigate');

            if (view === "nots") {
              $("#accountViewRegion").html(this.notView.render().el);
            } else if (view === "general") {
              $("#accountViewRegion").html(this.genView.render().el);
            } else if (view === "pay") {
              $("#accountViewRegion").html(this.payView.render().el);
            } else if (view === "support") {
              $("#accountViewRegion").html(this.supView.render().el);
            }

          }

          
      });
});