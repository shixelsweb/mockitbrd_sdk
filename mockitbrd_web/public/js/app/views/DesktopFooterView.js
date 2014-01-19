define(['jquery', 'hbs!templates/desktopFooter', 'backbone', 'marionette'],
    function ($, template, Backbone) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend({
        template:template,

        events: {
			'mouseover .MB-nav-logo': 'startHover',
			'mouseout .MB-nav-logo': 'endHover'
        },

		startHover: function() {
			$('.MB-nav-logo').addClass('pulse');
		},

		endHover: function() {
			$('.MB-nav-logo').removeClass('pulse');
		}
	});
});