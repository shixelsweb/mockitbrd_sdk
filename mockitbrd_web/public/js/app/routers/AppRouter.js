define(['backbone', 'marionette'], function(Backbone, Marionette) {
   return Backbone.Marionette.AppRouter.extend({
       //"index" must be a method in AppRouter's controller
       appRoutes: {
          //Main App Routes
           "": "index",
           "login": "login",
           "register": "register",
           //Top Level Navigation routes
           "services": "services",
           "team": "team",
           "contact": "contact",
           //Team Member Routes
           "earl": "earl",
           "fara": "fara",
           "clee": "clee",
           //Learn More Routes
           "educationLearnMore": "educationLearnMore",
           "candidateLearnMore": "candidateLearnMore",
           "professionalLearnMore": "professionalLearnMore",
           //Pricing Routes
           "educationPricing": "educationPricing",
           "enterprisePricing": "enterprisePricing",
           "candidatePricing": "candidatePricing",
           "professionalPricing": "professionalPricing"
       }
   });
});