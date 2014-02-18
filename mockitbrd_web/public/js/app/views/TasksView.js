define(['jquery', 'views/CreateTaskView', 'moment', 'models/Model', 'hbs!templates/tasks', 'backbone', 'marionette'],
    function ($, CreateTaskView, moment, Model, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          events: {
            'click .MB_create_interview': 'beginCreate'
          },

          model: null,
          user: null,
          tasks: null,
          calendar: {},

          initialize: function() {

            this.user = MB.api.user($.parseJSON(MB.session.give('session')).user);
            this.calendar.month = moment().format("MMMM");
            this.calendar.year = moment().format('YYYY');
            this.user.tasks = MB.api.getTasks({'user_id': this.user._id, 'type': this.user.personal.user_type}, 'tasks');
            this.user.interviews = MB.api.getTasks({'user_id': this.user._id, 'type': this.user.personal.user_type}, 'interviews');

            if(this.user.personal.user_type === "candidate") {
              this.user.isCandidate = true;
            } else {
              this.user.isCandidate = false;
            }
            for(var i = 0; i < this.user.tasks.length; i++) {
              if(this.user.tasks[i].type === 'interview') {
                this.user.tasks[i].typeClass = 'isInterview';
              } else {
                this.user.tasks[i].typeClass = 'notInterview';
              }
            }
            console.log(this.user);
            this.model = new Model({
              user: this.user,
              calendar: this.calendar
            });
          },
          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
            $('.left-menu-item').removeClass('active');
            $('.MB-interviews').addClass('active');
          },
          beginCreate: function(e) {
            MB.body.ensureEl();
            MB.body.$el.addClass('modal-black-show');
            MB.confirmRegion.show( new CreateTaskView());
          }
      });
});