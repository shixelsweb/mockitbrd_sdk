define(['jquery', 'models/Model', 'moment', 'hbs!templates/dashboardMain', 'backbone', 'marionette'],
    function ($, Model, moment, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          tasks: null,
          model: null,
          today: null,

          events: {
            'click .menu-item': 'onMenuItemClick',
            'mouseover .calendar-item': 'onMenuItemHover',
            'mouseout .calendar-item': 'oneMenuItemOut'
          },
          initialize: function() {
            this.tasks = MB.api.getUserTasksFull($.parseJSON(MB.session.give('session')).user);
            this.today = this.getToday();
            this.tasks = this.checkIfInterview(this.tasks);

            this.model = new Model({
              tasks: this.tasks,
              today: this.today
            });
          },
          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
          },
          getToday: function() {
            return moment().format('dddd, MMMM Do YYYY');
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
          },
          checkIfInterview: function(tasks) {
            for (var i = 0; i < tasks.length; i++) {
              if (tasks[i].type === 'interview') {
                tasks[i].isInterview = true;
              } else {
                tasks[i].isInterview = false;
              }
            }

            return tasks;
          }
      });
});