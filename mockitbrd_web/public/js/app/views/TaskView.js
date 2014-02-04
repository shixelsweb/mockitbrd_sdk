define(['jquery', 'models/Model', 'hbs!templates/tasks', 'backbone', 'marionette'],
    function ($, Model, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          model: null,
          user: null,
          tasks: null,

          initialize: function() {

            this.user = MB.api.user($.parseJSON(MB.session.give('session')).user);
            this.tasks = MB.api.getUserTasksFull(this.user._id);

            if(($.parseJSON(MB.session.give('session')).user_type) === "candidate") {
              isCandidate = true;
            } else {
              isCandidate = false;
            }
            for(var i = 0; i < this.tasks.length; i++) {
              if(isCandidate && this.tasks[i].type === "interview") {
                this.tasks[i].taskUser = MB.api.user(this.tasks[i].interviewer);
                this.tasks[i].isInterview = true;
              }
              if(this.tasks[i].type !== "interview") {
                this.tasks[i].isInterview = false;
              }
            }
            this.model = new Model({
              tasks: this.tasks,
              isCandidate: isCandidate
            });
          },
          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
            $('.left-menu-item').removeClass('active');
            $('.MB-interviews').addClass('active');
          }
      });
});