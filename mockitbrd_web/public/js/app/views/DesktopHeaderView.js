define(['jquery', 'hbs!templates/desktopHeader', 'backbone', 'marionette'],
    function ($, template, Backbone) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend({
        template:template,

        events: {
			'click #team_link': 'goToByScroll',
			'click #contact_link': 'goToByScroll'
        },

        initialize: function () {
            $(window).scroll(function(){
				MB.headerRegion.ensureEl();

				if ($(this).scrollTop() > 470){
					MB.headerRegion.$el.addClass('solid');
				}
				else{
					MB.headerRegion.$el.removeClass('solid');
				}
			});
        },

              // This is a functions that scrolls to #{blah}link
		goToByScroll: function(ev){
			// Remove "link" from the ID
			ev.preventDefault();
			id = $(ev.target).data('scrolllink');
			// Scroll to Id
			MB.body.ensureEl();
			MB.body.$el.animate({scrollTop: $("#"+id).offset().top - 40},'slow');

		}
	});
});