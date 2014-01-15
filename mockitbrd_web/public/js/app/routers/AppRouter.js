define(['backbone', 'marionette'], function(Backbone, Marionette) {
   return Backbone.Marionette.AppRouter.extend({
       //"index" must be a method in AppRouter's controller
       appRoutes: {
          //Main App Routes
           "": "index",
           "login": "login",
           "register": "register",
           //Top Level Navigation routes
           "learnmore": "services",
           "team": "team",
           "contact": "contact",
           //Team Member Routes
           "team/earl": "earl",
           "team/fara": "fara",
           "team/clee": "clee",
           //Learn More Routes
           "learnmore/education": "educationLearnMore",
           "learnmore/candidates": "candidateLearnMore",
           "learnmore/professionals": "professionalLearnMore",
           //Pricing Routes
           "pricing/education": "educationPricing",
           "pricing/enterprise": "enterprisePricing",
           "pricing/candidates": "candidatePricing",
           "pricing/professionals": "professionalPricing"
       }
   });
});