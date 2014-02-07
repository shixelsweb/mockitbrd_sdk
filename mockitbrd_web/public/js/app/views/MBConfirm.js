define(['jquery', 'models/Model', 'hbs!templates/confirm', 'backbone', 'marionette'],
    function ($, Model, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
      template:template,

      title: null,
      body: null,
      model: null,
      showNo: null,

      events:{
        'click .yes':'yes',
        'click .no':'no',
        'click .close': 'no'
       },

      initialize: function(options){
          MB.body.ensureEl();
          this.commands = options.commands;
          this.showNo = options.showNo;
          
         

          this.model = new Model({
              title: options.title,
              body: options.body
        });
      },
      onRender: function() {
        this.$el = this.$el.children();
        this.setElement(this.$el);
         if (this.showNo === false) {
            console.log('fix buttons');
            $('.MB-confirm-no').delete;
            $('.MB-confirm-yes').text('Ok');
          }
      },
      yes: function(){
         MB.body.$el.removeClass('modal-black-show');
         this.commands.execute('yes');
         this.close();
      },
      no: function(e){
        e.preventDefault();
        MB.body.$el.removeClass('modal-black-show');
        this.close();
      }
    });
});