define(['jquery', 'hbs!templates/interview', 'backbone', 'marionette', 'webrtc', 'socket'],
    function ($, template, Backbone, SimpleWebRTC, socket) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          shareButton: $('.interview-share'),
          webrtc: null,
          confirm: null,

          events:{
            'hover #remoteVideo': 'toggleToolbar',
            'click .interview-switch': 'switchVideos',
            'click .interview-off': 'endVideo',
            // 'click .interview-share': 'shareScreenHandler',
            'click .interview-mute': 'interviewVolume',
            'click .interview-unmute': 'interviewVolume'
          },

          initialize: function(options) {
              this.confirm = options.confirm;
              this.createConnection(options.webrtc, options.interview_id);
              this.setShareButton(true);
          },
          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);

          },
          setShareButton: function(value) {
             this.shareButton.text(value ? 'Share screen' : 'Stop sharing');
          },
          setRoom: function(name) {
                $('.interview-title').text(name);
                $('.interview-subTitle').text('Link to join: ' + location.href);
                $('.interview-view').addClass('active');
          },
          createConnection: function (SimpleWebRTC, id) {
            var self = this;
            this.webrtc = new SimpleWebRTC({
                // the id/element dom element that will hold "our" video
                localVideoEl: 'localVideo',
                // the id/element dom element that will hold remote videos
                remoteVideosEl: 'remoteVideo',
                // immediately ask for camera access
                autoRequestMedia: true,
                debug: false,
                detectSpeakingEvents: true,
                autoAdjustMic: false
            });

            this.webrtc.on('readyToCall', function() {
                if (location.hash.split('/')[1] === id) {
                  self.webrtc.joinRoom(id);
                  self.setRoom(id);
                }
              });
          },
          toggleToolbar: function() {
            $('#interview-video-toolbar').toggle();
          },
          switchVideos: function() {
            var remoteVid = $('#remoteVideo video');
            var localVid = $('#localVideo');
            var remoteVidSrc = remoteVid.attr('src');
            var localVidSrc = localVid.attr('src');

            if(this.webrtc.webrtc.localStream && (this.webrtc.webrtc.peers.length > 0)) {
              remoteVid.attr('src', localVidSrc);
              localVid.attr('src', remoteVidSrc);
            } else if (this.webrtc.webrtc.localStream && (this.webrtc.webrtc.peers.length <= 0)) {

              if (!localVid.attr('src')) {
                $('#tempVideo').css('display', 'none');
                localVid.attr('src', $('#tempVideo').attr('src'));
                $('#tempVideo').attr('src', '');
              } else {
                  $('#tempVideo').css('display', 'block');
                  $('#tempVideo').attr('src', localVidSrc);
                  localVid.attr('src', '');
              }
            }
          },
          endVideo: function() {
            var self = this;
            MB.body.ensureEl();
            MB.body.$el.addClass('modal-black-show');

            var stopVideo = new Backbone.Wreqr.Commands();

            stopVideo.addHandler('yes', function(){
              self.webrtc.stopLocalVideo();
              self.webrtc.leaveRoom();
              $('#localVideo').attr('src', '');
              MB.appRouter.navigate('dashboard', {trigger: true});
            });
            MB.confirmRegion.show( new this.confirm({commands: stopVideo, 'title': 'Are you sure you want to exit this interview?', 'body': 'By exiting this video you will be removed from the room, you can return via your Tasks tab.'}));
          },
          interviewVolume: function(e) {
            var volumeButton = $(e.currentTarget);

            if (this.webrtc.roomName) {
              if (volumeButton.data('volume') === "on") {
                this.webrtc.mute();
                volumeButton.hide();
                $('.interview-unmute').css('display', 'block');
              } else if(volumeButton.data('volume') === "off") {
                this.webrtc.unmute();
                volumeButton.hide();
                $('.interview-mute').css('display', 'block');
              }
            }
          }
      });
});

//DONT THINK WE WILL EVER NEED THIS BUT WILL KEEP JUST IN CASE
//             if (room) {
//                 setRoom(room);
//             } else {
//                 $('form').submit(function () {
//                     var val = $('#sessionInput').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
//                     webrtc.createRoom(val, function (err, name) {
//                         console.log(' create room cb', arguments);
//                         var newUrl = location.pathname + '?' + name;
//                         if (!err) {
//                             history.replaceState({foo: 'bar'}, null, newUrl);
//                             setRoom(name);
//                         } else {
//                             console.log(err);
//                         }
//                     });
//                     return false;
//                 });
//             }

//CANT DO THIS WITHOUT HTTPS
          // shareScreenHandler: function() {
          //   console.log("share!");
          //   if (this.webrtc.getLocalScreen()) {
          //         this.webrtc.stopScreenShare();
          //         this.setShareButton(true);
          //     } else {
          //         this.webrtc.shareScreen(function (err) {
          //             if (err) {
          //                 this.setShareButton(true);
          //             } else {
          //                 this.setShareButton(false);
          //             }
          //         });
          //     }
          // },
