define(['jquery', 'moment', 'models/Model', 'hbs!templates/createtask', 'backbone', 'marionette'],
    function ($, moment, Model, template, Backbone) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.ItemView.extend({
          template:template,

          user: null,
          model: null,

          events:{
          'click .no':'no',
          'click .close': 'no',
          'change .cat_drop_down': 'populateDropDown'
          },
          initialize: function() {
            this.user = MB.api.user($.parseJSON(MB.session.give('session')).user);
            this.tags = MB.api.tags();
            console.log(this.tags);

            if (this.user.user_type === 'candidate') {
              this.user.isCandidate = true;
            } else {
              this.user.isCandidate = false;
            }

            this.user.calendar = {};
            this.user.calendar.day = moment().format('DD MMM');
            this.user.calendar.year = moment().format('YYYY');

            this.model = new Model({
              user: this.user,
              tags: this.tags
            })
          },
          onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            this.$el = this.$el.children();
            this.setElement(this.$el);
          },
          no: function(e){
            e.preventDefault();
            MB.body.$el.removeClass('modal-black-show');
            this.close();
          },
          populateDropDown: function(e) {
            var category = $(e.currentTarget).val();
            for (var i = 0; i < this.tags.length; i++) {
              if (category === this.tags[i].name) {
                $('.tag_drop_down').html('<option>Choose a subject</option>').attr('disabled', false);
                for (var j = 0; j < this.tags[i].tags.length; j++) {
                  $('.tag_drop_down').append('<option data-tag="' + this.tags[i].tags[j].name + '">'+ this.tags[i].tags[j].name + '</option>');
                }
              } else {
                $('.tag_drop_down').html('<option><i class="fa fa-arrow-circle-o-left"></i> Pick Category</option>').attr('disabled', 'disabled');
              }
            }
          }
      });
});