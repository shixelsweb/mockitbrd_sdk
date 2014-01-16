/*
    MBModalBlack
    - Creates a popup modal with a black see through background

    Use:
    this.showModal(VIEW_NAME,'black'); <- in DecktopController.js
*/
define(["MB","jquery", "backbone", 'marionette', 'underscore'],
    function(MB, $, Backbone, Marionette, _) {
        // Creates a new Backbone Model class object
        var MBModalBlack = Backbone.Marionette.Region.extend({
            el: "#MB-modal-black .modal",

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
        return  MBModalBlack;

    }

);