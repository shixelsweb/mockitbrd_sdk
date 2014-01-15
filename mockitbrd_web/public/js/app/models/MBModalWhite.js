define(["MB","jquery", "backbone", 'marionette', 'underscore'],
    function(MB, $, Backbone, Marionette, _) {
        // Creates a new Backbone Model class object
        var MBModalWhite = Backbone.Marionette.Region.extend({
            el: "#MB-modal-white .modal",

            events: {
                "click .MB-modal-close": "hideModal"
            },

            constructor: function() {
                _.bindAll(this);
                Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
                this.on('view:show', this.showModal, this);
            },

            getEl: function(selector){
                var $el = $(selector);

                $el.on('hidden', this.close);

                return $el;
            },

            showModal: function(view) {
                view.on('close', this.hideModal, this);
                this.$el_region.modal('show');
            },

            hideModal: function(){
                console.log("hide");
                this.$el_region.modal('hide');
            }
        });


        // Returns the Model class
        return  MBModalWhite;

    }

);