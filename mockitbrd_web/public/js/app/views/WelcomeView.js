define( ['MB', 'backbone', 'marionette', 'jquery', 'models/Model', 'hbs!templates/welcome'],
    function(MB, Backbone, Marionette, $, Model, template) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend( {
            template: template,
            model: new Model({
                mobile: MB.mobile
            }),

            // View Event Handlers
            events: {
                'click #learnMore_link': 'goToByScroll'
            },

            onRender: function () {
              // get rid of that pesky wrapping-div
              // assumes 1 child element.
              this.$el = this.$el.children();
              this.setElement(this.$el);
            },

            goToByScroll: function(ev){
                ev.preventDefault();

                var id = $(ev.target).data('scrolllink');
                var section = $("#"+id).offset() || $('body').offset();

                MB.body.ensureEl();

                if (section) {
                    MB.body.$el.animate({scrollTop: section.top - 20},'slow');
                }
            }
        });
    });