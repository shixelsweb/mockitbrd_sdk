define(['jquery', 'models/Model', 'hbs!templates/popup', 'backbone', 'marionette'],
    function ($, Model, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
      template:template,

      title: null,
      body: null,
      model: null,

      events:{
        'click .ok':'ok',
        'click .close': 'ok'
       },

      initialize: function(options){
          MB.body.ensureEl();
          this.commands = options.commands;          

          this.model = new Model({
              title: options.title,
              body: options.body
        });
      },
      onRender: function() {
        this.$el = this.$el.children();
        this.setElement(this.$el);
      },
      ok: function(){
         MB.body.$el.removeClass('modal-black-show');
         this.commands.execute('ok');
         this.close();
      }
    });
});