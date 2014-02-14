define([
    'jquery',
    'models/Model',
    'views/MBPopup',
    'views/MBConfirm',
    'views/PostView',
    'moment',
    'hbs!templates/user',
    'backbone',
    'marionette' ,
    'edit'],
    function (
    $,
    Model,
    MBPopup,
    MBConfirm,
    PostView,
    moment,
    template,
    Backbone ) {
    //ItemView provides some default rendering logic
    return Backbone.Marionette.ItemView.extend({
        template:template,

        events: {
          'click .MB-edit-profile': 'profileEditMode',
          'mouseover .MB-user-star': "onHoverStar",
          'mouseout .MB-user-star': "unhoverStar",
          'change #new-user-pic': "uploadUserPic",
          'click .MB-post-button': "makePost",
          'click .MB-user-connect': "connectHandler",
          'click .MB-user-star': "starHandler"
        },

        model: null,
        user: null,
        currentUser: null,
        isOwner: null,
        isStarred: null,
        isConnectedActive: null,
        isConnectedPending: null,
        notConnected: null,
        userPosts: [],
        skillPack: [],
        isChanged: null,

        initialize:function(options) {

          this.user = options.user;
          this.currentUser = MB.api.user($.parseJSON(MB.session.give('session')).user);
          if (this.currentUser.social.interactions) {
            this.isStarred = this.checkIfStarred(this.currentUser.social.interactions.starred, this.user._id);
          } else {
            this.isStarred = false;
          }

          this.isConnectedActive = this.checkIfConnected(this.currentUser.social.connections, this.user._id);

          if(this.user._id === this.currentUser._id) {
            this.isOwner = true;
          } else {
            this.isOwner = false;

          }
          this.skillPack = [];

          if (this.user.app_config.skills) {
            for (var i = 0; i < this.user.app_config.skills.length; i++) {
              var skills = this.user.app_config.skills[i];
              var category = Object.getOwnPropertyNames(skills)[0];
              var skillSet = {"category": category.replace("-", " "), "skills": skills[category]};
              this.skillPack.push(skillSet);
            }
          }

          this.model = new Model ({
            user: this.user,
            isOwner: this.isOwner,
            isStarred: this.isStarred,
            isConnectedPending: this.isConnectedPending,
            isConnectedActive: this.isConnectedActive,
            notConnected: this.notConnected,
            skills: this.skillPack
          });
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
          if (this.user.app_config.posts) {
            for (var i = 0; i < this.user.app_config.posts.length; i++) {
              var post = new PostView({'user': this.user._id, 'post': this.user.app_config.posts[i]});
              this.renderPost(post);
            }
          }
        },
        renderPost: function(post) {
           var selector = '.user-posts';
           var html = this.template(this.model.toJSON());
           this.$el.find(selector).prepend(post.render().el);
        },
        checkIfConnected: function(connections, profile_viewing) {
          var connectionCheck = false;
          this.notConnected = true;
          if (connections) {
            for (var i = 0; i < connections.length; i++) {
              if(connections[i].user_id === profile_viewing) {
                 this.notConnected = false;
                  if (connections[i].status === 'pending') {
                    this.isConnectedPending = true;
                  } else if (connections[i].status === 'active'){
                    connectionCheck = true;
                  }
              }
            }
          } else {
            this.notConnected = true;
          }
          return connectionCheck;

        },
        checkIfStarred: function(stars, profile_viewing) { //check to see if user is favorited (starred) by the current session user
          var starCheck = false;

          if (stars) {
            for (var i = 0; i < stars.length; i++) {
              if (stars[i].user_id === profile_viewing) {
                starCheck = true;
              } else {
                starCheck = false;
              }
            }
          } else {
            starCheck = false;
          }
          return starCheck;
        },
        profileEditMode: function(e) {
          $.fn.editable.defaults.mode = 'inline';
          $(e.currentTarget).addClass('MB-edit-mode');

          $('.user_profile_job_status').editable({
              type: 'select',
              pk: 1,
              url: '/post',
              title: 'Job Status',
              source: [
                {value: 1, text: 'Actively Seeking Employement'},
                {value: 2, text: 'Not Actively Seeking Employement'},
                {value: 3, text: 'Hired!'},
                {value: 4, text: 'Currently Employed'}
             ]

          });

          $('.upload-pic').toggle();

          $('.user_profile_job_title').editable('toggle',{
              type: 'text',
              pk: 1,
              url: '/post',
              title: 'Job Title',

          }, 'toggle');

          $('.user_profile_location').editable({
              type: 'text',
              pk: 1,
              url: '/post',
              title: 'Location',

          });
        },
        onHoverStar: function(e) {
          var starEvent = $(e.currentTarget).attr('starEvent');

          if (starEvent === 'star') {
             $(e.currentTarget).removeClass('fa-star-o').addClass('fa-star');
          } else if (starEvent === 'unstar') {
            $(e.currentTarget).removeClass('fa-star').addClass('fa-star-o');
          }
        },
        unhoverStar: function(e) {
          var starEvent = $(e.currentTarget).attr('starEvent');

          if (starEvent === 'star') {
            $(e.currentTarget).removeClass('fa-star').addClass('fa-star-o');
          } else if (starEvent === 'unstar') {
            $(e.currentTarget).removeClass('fa-star-o').addClass('fa-star');
          }
        },
        uploadUserPic: function(e) {

          var files = e.target.files;
          var tempFile = $(e.currentTarget)[0].files[0];
          var user_id = this.currentUser._id;
          var data = new FormData();

          if (tempFile) {
            var fileType = tempFile.type.split('/')[0];
          }

          var backToUpload = new Backbone.Wreqr.Commands();

          backToUpload.addHandler('ok', function(){
            $('.pic-upload-button').show();
            $('.pic-upload-spinner').fadeOut();
            tempFile = null;
          });
          $.each($(e.currentTarget)[0].files, function(key, value){ data.append("image", value);});
          data.append("user_id", user_id);

          if ((tempFile !== null) && !fileType || (fileType !== 'image')) {
            MB.body.ensureEl();
            MB.body.$el.addClass('modal-black-show');
            MB.confirmRegion.show( new MBPopup({commands: backToUpload, 'title': 'Invalid image type', 'body': 'File must be an image (jpg, png, gif, etc)'}));
          } else if(fileType === 'image') {
            $('.pic-upload-button').hide();
            $('.pic-upload-spinner').fadeIn();
            MB.api.uploadPic(data, tempFile);
          }
        },
        makePost: function(e) {

          var post = $('.user-profile-wall-poster-top textarea').val();
          var user = this.currentUser._id;
          var date = moment().format('dddd, MMMM Do YYYY, h:mma');

          if (post === "") {
            $('.post-error').text('Please enter a post!');
            $('.post-error').show();
          } else {
              $('.post-error').hide();
              $('button.MB-post-button').prop('disabled', true);
              var post_data = {'post': post, 'date': date,  'user_id': user, 'comments': [], 'likes': []};
              MB.api.postStatus(post_data);
          }

        },
        connectHandler: function(e) {
          var connectType = $(e.currentTarget).attr('connect');
          var send = {'user': this.currentUser._id, 'connect_to': this.user._id};
          var unconnectCommand = new Backbone.Wreqr.Commands();
          var self = this;
          var change = '#connect_' + this.user._id;

          if (connectType === 'connect') {
            this.isChanged = MB.api.connect(send);
            if (this.isChanged) {
                this.user =  MB.api.user($.parseJSON(MB.session.give('session')).user);
                $(change).html('Pending');
                $(change).attr('connect', 'unconnect')
                $(change).addClass('disabled');
             }
          } else if (connectType === 'unconnect') {
              MB.body.ensureEl();
              MB.body.$el.addClass('modal-black-show');
              unconnectCommand.addHandler('yes', function(){
                self.isChanged = MB.api.unconnect(send);
                if (self.isChanged) {
                    self.user =  MB.api.user($.parseJSON(MB.session.give('session')).user);
                    $(change).html('<i class="fa fa-plus"></i>&nbsp;&nbsp;Connect');
                    $(change).attr('connect', 'connect')
                    $(change).removeClass('disabled');
               }
              });
              MB.confirmRegion.show( new MBConfirm({commands: unconnectCommand, 'title': 'Are you sure you want to unconnect from this user?', 'body': 'You will need to reconnect and be approved in the future.'}));
          }

        },
        starHandler: function(e) {
          var starEvent = $(e.currentTarget).attr('starevent');
          var send = {'user': this.currentUser._id, 'what_id': this.user._id, 'what': 'person'};

          if (starEvent === 'star') {
             MB.api.star(send);
          } else if (starEvent === 'unstar') {
            MB.api.unstar(send);
          }

        }
   });
  });