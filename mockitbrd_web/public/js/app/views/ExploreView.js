define(['jquery', 'models/Model', 'views/MBConfirm', 'hbs!templates/explore', 'backbone', 'marionette'],
    function ($, Model, MBConfirm, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          userStore: null,
          model: null,
          user: null,
          newestStore: null,
          candStore: null,
          intStore: null,
          activeStore: null,
          connStore: null,
          popStore: null,
          blockedList: null,
          isChanged: null,
          featStore: null,

          events: {
            'click .MB-submenu li': 'handleExlporeMenuClick',
            'click .MB-user-connect': 'connectHandler'
          },

          initialize: function() {

            //TODO: Add "No showing - of - results", and also enable pagination
            
            this.user =  MB.api.user($.parseJSON(MB.session.give('session')).user);
            this.userStore = MB.api.allUsers();
            this.fixStore(this.userStore);
            this.newestStore = this.sortResults(this.userStore, 'date');

            this.model = new Model({
              results: this.newestStore
            })

            this.model.on('change', this.renderAgain, this);

          },
          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
            $('.left-menu-item').removeClass('active');
            $('.MB-connections').addClass('active');

            this.getSize();
          },
          renderAgain: function() {
            var html = this.template(this.model.toJSON());
            var selector = ".explore-results";

            //replace only the contents of the #list element
            this.$el.find(selector).replaceWith($(selector, html));
          },
          fixStore: function(users) {
            var connections = this.user.connections;
            var blocked_users = this.user.blocked_list;

            console.log(blocked_users);
            for (var i = 0; i < users.length; i++) {
              if (users[i].user_type === 'candidate') {
                users[i].isCandidate = true;
              } else {
                users[i].isCandidate = false;
              }
              if (users[i]._id === this.user._id) {
                users[i].isOwner = true;
              } else {
                users[i].isOwner = false;
              }
              if (connections) {
                for (var j = 0; j < connections.length; j++) {
                  if(connections[j].user_id === users[i]._id) {
                      users[i].isConnected = true;
                      if (connections[j].status === 'pending') {
                         users[i].status = 'Pending';
                      } else if (connections[j].status === 'active') {
                        users[i].status = 'Connected';
                      }
                  }
                }
              }
            if(blocked_users) {
              for (var k = 0; k < blocked_users.length; k++) {
                 if(blocked_users[k].user_id === users[i]._id) {
                    users[i].isBlocked = true;
                   }
                }
              }
            }
          },
          sortResults: function(results, sortBy) {

            if(sortBy === 'date') {
               var sorted = results.sort(function(a,b) {
                var dateA = new Date(parseInt(a.signup_date));
                var dateB = new Date(parseInt(b.signup_date));

                 return dateB-dateA;
              });
             } else if (sortBy === 'active') {
                var sorted = results.sort(function(a,b) {
                var activeA = parseInt(a.login_count);
                var activeB = parseInt(b.login_count);

                 return activeB-activeA;
              });
             } else if (sortBy === 'popular') {
                var sorted = results.sort(function(a,b) {
                var likeA = parseInt(a.liked_by);
                var likeB = parseInt(b.liked_by);

                 return likeB-likeA;
              });
             }
            return sorted;
          },
          handleExlporeMenuClick: function(e) {
            var sortBy = $(e.currentTarget).data('quickfilter');
            

            if (!$(e.currentTarget).hasClass('active')) {
              if (sortBy === 'candidates') {
                if (!this.candStore) {
                   this.candStore = MB.api.allCanidates();
                   this.fixStore(this.candStore);
                   this.candStore = this.sortResults(this.candStore, 'date');
                }
                this.model.attributes.results = this.candStore;
              } else if (sortBy === 'interviewers') {
                if (!this.intStore) {
                   this.intStore = MB.api.allInterviewers();
                   this.fixStore(this.intStore);
                   this.intStore = this.sortResults(this.intStore, 'date');
                }
                this.model.attributes.results = this.intStore;
              } else if (sortBy === 'newest') {
                if (!this.newestStore) {
                   this.userStore = MB.api.allUsers();
                   this.fixStore(this.userStore);
                   this.newestStore = this.sortResults(this.userStore, 'date');
                }
                this.model.attributes.results = this.sortResults(this.newestStore, 'date');
              } else if (sortBy === 'active') {
                if (!this.activeStore && !this.newestStore) {
                   this.activeStore = MB.api.allUsers();
                   this.fixStore(this.activeStore);
                   this.activeStore = this.sortResults(this.activeStore, 'date');
                } else if (!this.activeStore && this.newestStore) {
                  this.activeStore = this.newestStore;
                }
                this.model.attributes.results = this.sortResults(this.activeStore, 'active');
              } else if (sortBy === 'connections') {
                if (!this.connStore) {
                   var connections = this.user.connections;
                   var conns = [];
                   if (connections) {
                      for (var i = 0; i < connections.length; i++) {
                        conns.push(MB.api.user(connections[i].user_id));
                      }
                   }
                   this.connStore = conns;
                   this.fixStore(this.connStore);
                   this.connStore = this.sortResults(this.connStore, 'active');
                } 
                this.model.attributes.results = this.sortResults(this.connStore, 'active');
              } else if (sortBy === 'popular') {
                if (!this.popStore && !this.newestStore) {
                   this.popStore = MB.api.allUsers();
                   this.fixStore(this.popStore);
                   this.popStore = this.sortResults(this.popStore, 'popular');
                } else if (!this.popStore && this.newestStore) {
                  this.popStore = this.newestStore;
                }
                this.model.attributes.results = this.sortResults(this.popStore, 'popular');
              } else if (sortBy === 'featured') { //TODO: Add a featured mechanism somehow
                if (!this.featStore) {
                   this.featStore = null;
                } 
                this.model.attributes.results = this.featStore;
                
              }
              this.renderAgain();
            } 

            $('.MB-submenu li').removeClass('active');
            $(e.currentTarget).addClass('active');

          },
          getSize: function() {
             var height =  $(this.$el[0].lastElementChild).scrollHeight + 'px';
          },
          connectHandler: function(e) {
            var self = this;
            var connectType = $(e.currentTarget).attr('connect');
            var send = {'user': this.user._id, 'connect_to': $(e.currentTarget).attr('id').split('_')[1]};
            var unconnectCommand = new Backbone.Wreqr.Commands();
            var change = '#connect_' + $(e.currentTarget).attr('id').split('_')[1];

            if (connectType === 'connect') {
               this.isChanged = MB.api.connect(send);
               if (this.isChanged) {
                  this.refreshStore();
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
                      self.refreshStore();
                      $(change).html('<i class="fa fa-plus"></i>&nbsp;&nbsp;Connect');
                      $(change).attr('connect', 'connect')                            
                      $(change).removeClass('disabled');
                 }
                });
                MB.confirmRegion.show( new MBConfirm({commands: unconnectCommand, 'title': 'Are you sure you want to unconnect from this user?', 'body': 'You will need to reconnect and be approved in the future.'}));
            }
           
          },
          refreshStore: function() {
            this.user =  MB.api.user($.parseJSON(MB.session.give('session')).user);
            this.userStore = MB.api.allUsers();
            this.fixStore(this.userStore);
            this.newestStore = this.sortResults(this.userStore, 'date');
          }
      });
});