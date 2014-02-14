define(['jquery', 'models/Model', 'views/PostView', 'moment', 'hbs!templates/dashboardMain', 'backbone', 'marionette'],
    function ($, Model, PostView, moment, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          tasks: null,
          model: null,
          today: null,
          posts: null,
          user: null,

          events: {
            'click .menu-item': 'onMenuItemClick',
            'mouseover .calendar-item': 'onMenuItemHover',
            'mouseout .calendar-item': 'oneMenuItemOut'
          },
          initialize: function() {
            this.user = MB.api.user($.parseJSON(MB.session.give('session')).user);
            this.tasks = MB.api.getUserTasksFull(this.user._id);
            this.today = this.getToday();
            this.tasks = this.checkIfInterview(this.tasks);
            this.posts = MB.helper.getPostsToShow(this.user);
            this.model = new Model({
              tasks: this.tasks,
              today: this.today
            });
            console.log(this.user);
          },
          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
            if (this.posts) {
              for (var i = 0; i < this.posts.length; i++) {
                var post = new PostView({'user': this.posts[i].user_id, 'post': this.posts[i].post_id});
                this.renderPost(post);
              }
            }
          },
          renderPost: function(post) {
             var selector = '#dashboard-posts';
             var html = this.template(this.model.toJSON());
             this.$el.find(selector).prepend(post.render().el);
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