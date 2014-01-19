define(['jquery', 'hbs!templates/dashboardCalendar', 'backbone', 'marionette', 'moment', 'models/Model'],
    function ($, template, Backbone, Model) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          events: {
            'click .menu-item': 'onMenuItemClick',
            'mouseover .calendar-item': 'onMenuItemHover',
            'mouseout .calendar-item': 'oneMenuItemOut'
          },

          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
          },
          getToday: function() {
            return moment().format('dddd, MMMM Do');
          },
          onMenuItemClick: function(e) {
            e.preventDefault();

            $('.menu-item').removeClass('active');
            $(e.currentTarget).addClass('active');

            this.sortTasks($(e.currentTarget).data('sort'));
          },
          sortTasks: function(task) {
            var sortBy = "." + task;

            if(task !== 'all') {
              $( ".calendar-item" ).each(function( ) {
                var type = $(this).data('type');
                  if(type !== task) {
                    $(this).hide();
                    console.log($(this));
                  } else if (type === type) {
                    $(this).show();
                  }
              });
            } else {
              $( ".calendar-item" ).each(function( ) {
                  $(this).show();
              });
            }
          },
          onMenuItemHover: function(e){
            $(e.currentTarget).children('.close').show();
          },
          oneMenuItemOut: function(e){
            $(e.currentTarget).children('.close').hide();
          }
      });
});