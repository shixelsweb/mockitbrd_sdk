define(['jquery', 'models/Model', 'hbs!templates/explore', 'backbone', 'marionette'],
    function ($, Model, template, Backbone) {
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

          events: {
            'click .MB-submenu li': 'handleExlporeMenuClick',
            'mouseover .exp-result': 'handleExploreItemHover',
            'mouseout .exp-result': 'handleExploreItemUnHover'
          },

          initialize: function() {
            this.userStore = MB.api.allUsers();
            this.user =  MB.api.user($.parseJSON(MB.session.give('session')).user);
            

            this.fixStore(this.userStore);
            this.newestStore = this.sortByRecents(this.userStore, 'date');

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
              if (users[i].user_pic === '0') {
                users[i].pic = MB.api.userpic('default');
              } else {
                users[i].pic = MB.api.userpic(users[i]._id);
              }

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
          sortByRecents: function(results, sortBy) {

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
                   this.candStore = this.sortByRecents(this.candStore, 'date');
                }
                this.model.attributes.results = this.candStore;
                this.renderAgain();
              } else if (sortBy === 'interviewers') {
                if (!this.intStore) {
                   this.intStore = MB.api.allInterviewers();
                   this.fixStore(this.intStore);
                   this.intStore = this.sortByRecents(this.intStore, 'date');
                }
                this.model.attributes.results = this.intStore;
                this.renderAgain();
              } else if (sortBy === 'newest') {
                if (!this.newestStore) {
                   this.userStore = MB.api.allUsers();
                   this.fixStore(this.userStore);
                   this.newestStore = this.sortByRecents(this.userStore, 'date');
                }
                this.model.attributes.results = this.newestStore;
                this.renderAgain();
              } else if (sortBy === 'active') {
                if (!this.activeStore && !this.newestStore) {
                   this.activeStore = MB.api.allUsers();
                   this.fixStore(this.activeStore);
                   this.activeStore = this.sortByRecents(this.activeStore, 'date');
                } else if (!this.activeStore && this.newestStore) {
                  this.activeStore = this.newestStore;
                }
                this.model.attributes.results = this.sortByRecents(this.activeStore, 'active');
                this.renderAgain();
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
                   this.connStore = this.sortByRecents(this.connStore, 'active');
                } 
                this.model.attributes.results = this.sortByRecents(this.connStore, 'active');
                this.renderAgain();
              } else if (sortBy === 'popular') {
                if (!this.popStore && !this.newestStore) {
                   this.popStore = MB.api.allUsers();
                   this.fixStore(this.popStore);
                   this.popStore = this.sortByRecents(this.popStore, 'popular');
                } else if (!this.activeStore && this.newestStore) {
                  this.popStore = this.newestStore;
                }
                this.model.attributes.results = this.sortByRecents(this.popStore, 'popular');
                this.renderAgain();
              }
            } 

            $('.MB-submenu li').removeClass('active');
            $(e.currentTarget).addClass('active');

          },
          getSize: function() {
             var height =  $(this.$el[0].lastElementChild).scrollHeight + 'px';
             // $('.explore-facet-menu').css({'height': height});

          },
          handleExploreItemHover: function(e) {
            $(e.currentTarget).addClass('tossing');
          },
          handleExploreItemUnHover: function(e) {
            $(e.currentTarget).removeClass('tossing');
          }
      });
});