define(['jquery', 'hbs!templates/desktopHeader', 'backbone', 'marionette'],
    function ($, template, Backbone) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend({
        template:template,

        events: {
			'mouseover .MB-nav-logo': 'startHover',
			'mouseout .MB-nav-logo': 'endHover',
			'hover .login-button': 'handleLogin',
        },

		startHover: function() {
			$('.MB-nav-logo').addClass('pulse');
		},

		endHover: function() {
			$('.MB-nav-logo').removeClass('pulse');
		},
		handleLogin: function(e) {
			e.preventDefault();

			var isLoggedIn = MB.session.give('session');

			if (isLoggedIn) {
				$(e.currentTarget).attr('href', '#dashboard');
			} else {
				$(e.currentTarget).attr('href', '#login');
			}
		}
	});
});