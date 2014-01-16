/*
    MBModalBg
    - Creates a popup modal with an image as its background

    Use:
    this.showModal(VIEW_NAME, 'IMAGE_NAME_WITH_EXT'); <- in DecktopController.js

    ex of IMAGE_NAME_WITH_EXT = 'image.jpg' or 'image.png'
*/
define(["MB","jquery", "backbone", 'marionette', 'underscore'],
    function(MB, $, Backbone, Marionette, _) {
        // Creates a new Backbone Model class object
        var MBModalBg = Backbone.Marionette.Region.extend({
            el: "#MB-modal-bg .modal",

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
        return  MBModalBg;

    }

);